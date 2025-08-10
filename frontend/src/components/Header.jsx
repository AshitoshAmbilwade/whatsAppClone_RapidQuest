// src/components/Header.jsx
import React from 'react';

export default function Header({ contactName, contactNumber, onBack }) {
  return (
    <div className="bg-green-500 text-white p-4 sticky top-0 z-10">
      <div className="flex items-center max-w-4xl mx-auto">
        {/* Back button (visible only on mobile) */}
        {onBack && (
          <button 
            onClick={onBack} 
            className="md:hidden mr-3"
            aria-label="Back to chats"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
        
        <div className="flex-1 min-w-0">
          <h1 className="font-bold truncate">{contactName}</h1>
          <p className="text-sm truncate">{contactNumber}</p>
        </div>
      </div>
    </div>
  );
}