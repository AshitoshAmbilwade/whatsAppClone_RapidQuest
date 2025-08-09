// src/pages/Dashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import { io as socketIoClient } from "socket.io-client";
import {
  getConversations,
  getMessagesByWaId,
  createMessage,
  searchMessages
} from "../api/messageService";

export default function Dashboard() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingValue, setTypingValue] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const socketRef = useRef(null);
  const searchTimerRef = useRef(null);
  const messagesBottomRef = useRef(null);

  // Ensure data is array
  const maybeArray = (x) => {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    if (Array.isArray(x.data)) return x.data;
    if (Array.isArray(x.conversations)) return x.conversations;
    if (Array.isArray(x.messages)) return x.messages;
    return [];
  };

  // Normalize message
  const normalizeMessage = (msg) => {
    const m = { ...msg };
    if (!m.message_id) m.message_id = m._id || m.id || `local-${Date.now()}`;
    if (!m.timestamp) m.timestamp = new Date().toISOString();
    else {
      const parsed = new Date(m.timestamp);
      if (!isNaN(parsed)) m.timestamp = parsed.toISOString();
    }
    if (!m.direction) m.direction = "incoming";
    if (!m.type) m.type = "text";
    if (!m.status) m.status = "sent";
    return m;
  };

  // Load conversations
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await getConversations();
      setConversations(maybeArray(res));
    } catch (err) {
      console.error("Error loading conversations", err);
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Load messages
  const loadMessages = async (wa_id) => {
    try {
      setLoadingMessages(true);
      const res = await getMessagesByWaId(wa_id);
      const arr = maybeArray(res)
        .map(normalizeMessage)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(arr);
      setTimeout(() => messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      console.error("Error loading messages", err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadConversations();
  }, []);

  // Setup socket connection
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const socket = socketIoClient(base, { autoConnect: true });
    socketRef.current = socket;

    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));

    socket.on("new_message", (payload) => {
      const msg = normalizeMessage(payload);
      if (selectedConversation && msg.wa_id === (selectedConversation._id || selectedConversation.wa_id)) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      }
      loadConversations();
    });

    socket.on("notification", (notif) => {
      alert(notif.text); // 🔔 Simple browser alert for now
    });

    socket.on("message_status_update", ({ message_id, status }) => {
      setMessages((prev) => prev.map((m) => (m.message_id === message_id ? { ...m, status } : m)));
    });

    socket.on("disconnect", () => console.log("⚠️ Socket disconnected"));

    return () => socket.disconnect();
  }, [selectedConversation]);

  // Join/Leave room when chat changes
  useEffect(() => {
    if (!socketRef.current || !selectedConversation) return;
    const waId = selectedConversation._id || selectedConversation.wa_id;
    socketRef.current.emit("join_conversation", waId);
    loadMessages(waId);

    return () => {
      socketRef.current.emit("leave_conversation", waId);
    };
  }, [selectedConversation]);

  // Send message
  const handleSendMessage = async () => {
    if (!typingValue.trim() || !selectedConversation) return;

    const waId = selectedConversation._id || selectedConversation.wa_id;
    const payload = {
      wa_id: waId,
      name: selectedConversation.name || waId,
      text: typingValue,
      direction: "outgoing",
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    // Optimistic UI
    setMessages((prev) => [...prev, normalizeMessage(payload)]);
    setTypingValue("");
    setTimeout(() => messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    // Real-time emit
    socketRef.current.emit("send_message", payload);

    // Save to DB
    try {
      await createMessage(payload);
      loadConversations();
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  // Search conversations
  const handleSearchChange = (q) => {
    setSearchQuery(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      if (!q.trim()) {
        loadConversations();
        return;
      }
      try {
        const results = await searchMessages(q);
        const msgs = maybeArray(results);
        const map = new Map();
        msgs.forEach((m) => {
          const wa = m.wa_id || m._id || "unknown";
          const norm = normalizeMessage(m);
          if (!map.has(wa) || new Date(map.get(wa).timestamp) < new Date(norm.timestamp)) {
            map.set(wa, {
              _id: wa,
              wa_id: wa,
              name: norm.name || wa,
              last_message: norm.text,
              last_timestamp: norm.timestamp,
              unread_count: 0
            });
          }
        });
        setConversations(Array.from(map.values()));
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 300);
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 border-r flex flex-col">
        {/* Search */}
        <div className="p-3 bg-white border-b flex items-center gap-3">
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search or start new chat"
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          />
          <button className="p-2 rounded-full bg-gray-100">⚙</button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto bg-white">
          {loadingConversations ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations</div>
          ) : (
            conversations.map((conv) => {
              const id = conv._id || conv.wa_id;
              return (
                <div
                  key={id}
                  onClick={() => {
                    if (selectedConversation) {
                      socketRef.current.emit("leave_conversation", selectedConversation._id || selectedConversation.wa_id);
                    }
                    setSelectedConversation(conv);
                  }}
                  className={`flex items-center p-3 gap-3 cursor-pointer hover:bg-gray-50 ${
                    (selectedConversation?._id || selectedConversation?.wa_id) === id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    {(conv.name || id).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div className="truncate font-medium">{conv.name || id}</div>
                      <div className="text-xs text-gray-500">{formatTime(conv.last_timestamp)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="truncate text-sm text-gray-600">{conv.last_message || ""}</div>
                      {conv.unread_count > 0 && (
                        <div className="ml-2 bg-green-500 text-white rounded-full px-2 text-xs">{conv.unread_count}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b bg-white flex items-center gap-3">
          <button className="md:hidden" onClick={() => setSelectedConversation(null)}>←</button>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
            {(selectedConversation?.name || "").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{selectedConversation?.name || "Select a chat"}</div>
            <div className="text-xs text-gray-500">{selectedConversation?.wa_id || ""}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">Please select a conversation</div>
          ) : loadingMessages ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">No messages yet</div>
          ) : (
            messages.map((m) => (
              <div
                key={m.message_id}
                className={`max-w-[70%] p-3 rounded-lg ${
                  m.direction === "outgoing" ? "bg-green-200 self-end ml-auto" : "bg-white self-start"
                }`}
              >
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-500 text-right mt-1">{formatTime(m.timestamp)}</div>
              </div>
            ))
          )}
          <div ref={messagesBottomRef} />
        </div>

        {/* Input */}
        {selectedConversation && (
          <div className="p-3 border-t bg-white flex gap-2 items-center">
            <input
              value={typingValue}
              onChange={(e) => setTypingValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message"
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-green-500 text-white rounded-full"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
