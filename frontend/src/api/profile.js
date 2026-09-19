import client from './client';

export const getMyProfile = async () => {
  const response = await client.get('/profiles/me');
  return response.data;
};

export const updateMyProfile = async (data) => {
  const response = await client.put('/profiles/me', data);
  return response.data;
};

export const getProfileById = async (id) => {
  const response = await client.get(`/profiles/${id}`);
  return response.data;
};
