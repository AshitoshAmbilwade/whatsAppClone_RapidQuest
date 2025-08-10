import axiosInstance from './axiosInstance';

export async function getMessagesByWaId(contactWaId, currentUserWaId) {
  try {
    const res = await axiosInstance.get(`/api/messages/${contactWaId}`, {
      params: { user: currentUserWaId }
    });
    return res.data;
  } catch (err) {
    console.error(`Error fetching messages for ${contactWaId}:`, err);
    return { success: false, messages: [] };
  }
}

export async function sendMessage(messageData) {
  try {
    const res = await axiosInstance.post('/api/messages', messageData);
    return res.data;
  } catch (err) {
    console.error('Error sending message:', err);
    return { success: false };
  }
}
