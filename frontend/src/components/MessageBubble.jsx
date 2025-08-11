import React from 'react';

export default function MessageBubble({ message }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'delivered':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M8.707 5.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L5 8.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'read':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M8.707 5.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L5 8.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return '';
    }
  };

  // Align based on message.direction
  const isIncoming = message.direction === 'outgoing';

  return (
    <div className={`flex mb-2 px-2 md:px-4 ${isIncoming ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[80%] sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl shadow 
        ${isIncoming 
          ? 'bg-[#DCF8C6] rounded-br-none' 
          : 'bg-white rounded-bl-none'
        }`}
      >
        {/* Message text */}
        {message.text && (
          <p className="text-base text-gray-800 break-words">{message.text}</p>
        )}

        {/* Time + status */}
        <div className={`flex justify-end items-center space-x-1 mt-1 text-[11px] ${isIncoming ? 'text-gray-600' : 'text-gray-500'}`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isIncoming && <span className="ml-1">{getStatusIcon(message.status)}</span>}
        </div>

        {/* Tail for message bubble */}
        {isIncoming ? (
          <div className="absolute -right-1.5 bottom-0 w-3 h-3 overflow-hidden">
            <div className="absolute w-3 h-3 bg-[#DCF8C6] -rotate-45 transform origin-bottom-right"></div>
          </div>
        ) : (
          <div className="absolute -left-1.5 bottom-0 w-3 h-3 overflow-hidden">
            <div className="absolute w-3 h-3 bg-white -rotate-45 transform origin-bottom-left"></div>
          </div>
        )}
      </div>
    </div>
  );
}
