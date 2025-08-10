import React from 'react';

export default function Header({ contactName, contactNumber }) {
  return (
    <div className="flex items-center p-4 border-b bg-white shadow-sm">
      {/* Avatar placeholder */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-gray-600 font-bold">
          {contactName ? contactName.charAt(0) : '?'}
        </span>
      </div>

      {/* Contact info */}
      <div className="ml-3">
        <div className="font-semibold">{contactName || 'Unknown User'}</div>
        <div className="text-sm text-gray-500">{contactNumber || ''}</div>
      </div>
    </div>
  );
}
