import React from 'react';

export default function MessageBubble({ message, isOwn }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return <span className="text-blue-500">✓✓</span>;
      default:
        return '';
    }
  };

  return (
    <div className={`flex mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-xs md:max-w-sm lg:max-w-md px-3 py-2 rounded-lg shadow 
        ${isOwn ? 'bg-green-200 rounded-br-none' : 'bg-white rounded-bl-none'}`}
      >
        {/* Message text */}
        {message.text && (
          <p className="text-sm text-gray-900 break-words">{message.text}</p>
        )}

        {/* Time + status */}
        <div className="flex justify-end items-center space-x-1 mt-1 text-[11px] text-gray-500">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isOwn && <span>{getStatusIcon(message.status)}</span>}
        </div>
      </div>
    </div>
  );
}
