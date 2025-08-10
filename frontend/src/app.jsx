// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage.jsx';
import { UserProvider } from './context/UserContext.jsx';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat/:wa_id" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </UserProvider>
  );
}
