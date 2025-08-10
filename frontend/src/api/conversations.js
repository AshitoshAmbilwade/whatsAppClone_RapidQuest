import axiosInstance from './axiosInstance';

export async function getConversations() {
  try {
    const res = await axiosInstance.get('/conversations');
    return res.data;
  } catch (err) {
    console.error('Error fetching conversations:', err);
    return { success: false, conversations: [] };
  }
}
