import apiInstance from "./apiInstance";

// Get all conversations
export const getConversations = async () => {
  const response = await apiInstance.get("/api/messages/conversations");
  
  // Normalize response to always be an array
  if (Array.isArray(response.data)) {
    return response.data; // backend returned array directly
  } else if (Array.isArray(response.data.conversations)) {
    return response.data.conversations; // backend returned { conversations: [...] }
  } else if (Array.isArray(response.data.data)) {
    return response.data.data; // backend returned { data: [...] }
  }
  
  return []; // fallback if something goes wrong
};

// Get messages for a specific wa_id
export const getMessagesByWaId = async (wa_id) => {
  const response = await apiInstance.get(`/api/messages/${wa_id}`);
  return response.data;
};

// Search messages
export const searchMessages = async (query) => {
  const response = await apiInstance.get(`/api/messages/search`, {
    params: { q: query },
  });
  return response.data;
};

// Mark messages as read
export const markMessagesAsRead = async (wa_id) => {
  const response = await apiInstance.patch(`/api/messages/${wa_id}/read`);
  return response.data;
};

// Get messages with filters
export const getMessagesWithFilters = async (wa_id, filters) => {
  const response = await apiInstance.get(`/api/messages/${wa_id}/filter`, {
    params: filters,
  });
  return response.data;
};

// Create a new message
export const createMessage = async (messageData) => {
  const response = await apiInstance.post(`/api/messages`, messageData);
  return response.data;
};