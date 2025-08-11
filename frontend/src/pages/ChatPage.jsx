// src/pages/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { getConversations } from '../api/conversations';
import useSocket from '../hooks/useSocket';

export default function ChatPage() {
  const params = useParams();
  const navigate = useNavigate();
  const contactParam = params.wa_id;

  // Dynamically set the current user
  // If contact is Neha → current user is Ravi, else → current user is Neha
  const currentUser =
    contactParam === '929967673820'
      ?{ wa_id: '929967673820', name: 'Neha Joshi' } :{ wa_id: '919937320320', name: 'Ravi Kumar' };

  const [conversations, setConversations] = useState([]);
  const socket = useSocket(currentUser.wa_id);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getConversations().then((data) => {
      if (data.success) {
        setConversations(data.conversations);

        // Auto-navigate to first conversation if none selected
        if (!contactParam && !isMobile && data.conversations?.length > 0) {
          const first = data.conversations[0]._id;
          navigate(`/chat/${first}`, { replace: true });
        }
      }
    });
  }, [contactParam, navigate, isMobile]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${contactParam && isMobile ? 'hidden' : 'block'} w-full md:w-80 lg:w-96`}>
        <ChatList conversations={conversations} />
      </div>

      {/* Chat window */}
      <div className={`${contactParam ? 'block' : 'hidden md:block'} flex-1`}>
        {contactParam ? (
          <ChatWindow
            contactWaId={contactParam}
            socket={socket}
            currentUser={currentUser} // pass currentUser directly
          />
        ) : (
          !isMobile && (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center p-8 max-w-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                <h3 className="mt-4 text-2xl font-semibold text-gray-700">
                  WhatsApp Web
                </h3>
                <p className="mt-2 text-gray-500">
                  Select a chat to start messaging
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
