// src/pages/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useUser } from '../context/UserContext';
import { getConversations } from '../api/conversations';
import {useSocket} from '../hooks/useSocket';

export default function ChatPage() {
  const params = useParams();
  const navigate = useNavigate();
  const contactParam = params.wa_id; // may be undefined if route is /chats
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const socket = useSocket(user?.wa_id);

  useEffect(() => {
    getConversations().then((data) => {
      if (data.success) {
        setConversations(data.conversations);
        // if no contact in route, navigate to first conversation automatically
        if (!contactParam && data.conversations?.length > 0) {
          const first = data.conversations[0]._id;
          navigate(`/chat/${first}`, { replace: true });
        }
      }
    });
  }, [contactParam, navigate]);

  const contactWaId = contactParam;

  return (
    <div className="flex h-screen">
      <ChatList conversations={conversations} />
      <ChatWindow contactWaId={contactWaId} socket={socket} />
    </div>
  );
}
