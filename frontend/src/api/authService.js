import apiInstance from './apiInstance';

// Register admin user
export const registerUser = async (username, password) => {
  const { data } = await apiInstance.post('/api/auth/register', {
    username,
    password
    // role: 'admin' // optional since backend defaults it
  });
  return data;
};

// Login user
export const loginUser = async (username, password) => {
  const { data } = await apiInstance.post('/api/auth/login', {
    username,
    password
  });
  return data;
};
