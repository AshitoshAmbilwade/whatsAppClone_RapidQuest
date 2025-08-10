// src/pages/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useUser } from '../context/UserContext';
import { getConversations } from '../api/conversations';
import  useSocket  from '../hooks/useSocket';

export default function ChatPage() {
  const params = useParams();
  const navigate = useNavigate();
  const contactParam = params.wa_id;
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const socket = useSocket(user?.wa_id);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getConversations().then((data) => {
      if (data.success) {
        setConversations(data.conversations);
        // Only navigate automatically on desktop
        if (!contactParam && !isMobile && data.conversations?.length > 0) {
          const first = data.conversations[0]._id;
          navigate(`/chat/${first}`, { replace: true });
        }
      }
    });
  }, [contactParam, navigate, isMobile]);

  const contactWaId = contactParam;

  return (
    <div className="flex h-screen">
      {/* Chat List - Always visible on desktop, conditionally on mobile */}
      <div className={`${contactWaId && isMobile ? 'hidden' : 'block'} w-full md:w-80 lg:w-96`}>
        <ChatList conversations={conversations} />
      </div>
      
      {/* Chat Window - Hidden on mobile when no chat is selected */}
      <div className={`${contactWaId ? 'block' : 'hidden md:block'} flex-1`}>
        {contactWaId && <ChatWindow contactWaId={contactWaId} socket={socket} />}
        
        {/* Placeholder for desktop when no chat is selected */}
        {!contactWaId && !isMobile && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center p-8 max-w-md">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              <h3 className="mt-4 text-2xl font-semibold text-gray-700">WhatsApp Web</h3>
              <p className="mt-2 text-gray-500">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}