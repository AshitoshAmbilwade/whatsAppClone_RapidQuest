// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage.jsx';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat/:wa_id" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    
  );
}
