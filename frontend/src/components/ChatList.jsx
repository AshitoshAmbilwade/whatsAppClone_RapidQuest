// src/components/ChatList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function ChatList({ conversations }) {
  const { wa_id: activeChatId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter conversations based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = conversations.filter(conv => 
        (conv.name && conv.name.toLowerCase().includes(query)) || 
        (conv._id && conv._id.toLowerCase().includes(query))
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const handleChatSelect = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-gray-100 border-r overflow-y-auto h-screen">
      {/* Header with responsive padding */}
      <div className="p-3 md:p-4 border-b font-bold text-lg bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <div className="flex-1">Chats</div>
          {/* New chat button for desktop */}
          <button className="hidden md:block p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-2 bg-white sticky top-14 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full p-2 pl-10 rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filteredConversations.length === 0 ? (
        <div className="p-4 text-gray-500">
          {searchQuery ? `No results for "${searchQuery}"` : 'No conversations yet'}
        </div>
      ) : (
        <div className="pb-16 md:pb-0">
          {filteredConversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => handleChatSelect(conv._id)}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 ${
                activeChatId === conv._id ? 'bg-gray-300' : 'bg-white'
              }`}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-400 flex items-center justify-center text-white font-bold">
                {conv.name?.charAt(0) || conv._id?.charAt(0)}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold truncate">
                    {searchQuery && conv.name ? (
                      <>
                        {conv.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                          part.toLowerCase() === searchQuery.toLowerCase() ? 
                            <span key={i} className="bg-yellow-200">{part}</span> : 
                            part
                        )}
                      </>
                    ) : conv.name || conv._id}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {conv.last_timestamp
                      ? new Date(conv.last_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </div>
                </div>
                <div className="text-sm text-gray-600 truncate flex items-center">
                  {conv.last_message || 'No messages'}
                  {conv.unread_count > 0 && (
                    <span className="ml-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile bottom navigation */}
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
          <button className="p-3 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="p-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          <button className="p-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}