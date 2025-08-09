import api from './apiInstance';

export const sendPayload = async (payloadData) => {
  const { data } = await api.post('api/payload', payloadData);
  return data;
};
