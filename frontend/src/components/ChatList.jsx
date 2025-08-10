import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ChatList({ conversations, socket, onRefresh }) {
  const { wa_id: activeChatId } = useParams();

  // Default refresh: simply re-call onRefresh if provided
  const handleRefresh = () => {
    if (typeof onRefresh === 'function') {
      onRefresh();
    }
  };

  // Listen for socket events without disconnecting
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', handleRefresh);
    socket.on('status_updated', handleRefresh);

    return () => {
      socket.off('new_message', handleRefresh);
      socket.off('status_updated', handleRefresh);
    };
  }, [socket]);

  const formatTimeOrDate = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    return date.toDateString() === now.toDateString()
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString();
  };

  return (
    <div className="w-1/4 bg-gray-100 border-r overflow-y-auto">
      <div className="p-4 border-b font-bold text-lg">Chats</div>
      {conversations && conversations.length > 0 ? (
        conversations.map((conv) => (
          <Link
            key={conv._id}
            to={`/chat/${conv._id}`}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 ${
              activeChatId === conv._id ? 'bg-gray-300' : ''
            }`}
          >
            <div className="ml-3 flex-1">
              <div className="font-semibold">{conv.name || conv._id}</div>
              <div className="text-sm text-gray-600 truncate">
                {conv.last_message || 'No messages'}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {formatTimeOrDate(conv.last_timestamp)}
            </div>
          </Link>
        ))
      ) : (
        <div className="p-4 text-gray-500">No conversations yet</div>
      )}
    </div>
  );
}
