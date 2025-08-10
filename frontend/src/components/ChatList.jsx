import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ChatList({ conversations }) {
  const { wa_id: activeChatId } = useParams();

  return (
    <div className="w-1/4 bg-gray-100 border-r overflow-y-auto">
      <div className="p-4 border-b font-bold text-lg">Chats</div>
      {conversations.length === 0 ? (
        <div className="p-4 text-gray-500">No conversations yet</div>
      ) : (
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
              {conv.last_timestamp
                ? new Date(conv.last_timestamp).toLocaleTimeString()
                : ''}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
