import apiInstance from './apiInstance';

// ✅ Get all conversations
export const getConversations = () => apiInstance.get('/api/messages/conversations');
