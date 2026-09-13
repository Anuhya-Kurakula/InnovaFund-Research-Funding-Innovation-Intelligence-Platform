import client from './client';

/**
 * Innovation Scoring API Client Wrapper (Member 4 Integration)
 * Utilizes the platform's unified Axios HTTP client and token interceptor.
 */

export const calculateScore = async (payload) => {
  const response = await client.post('/scoring/calculate', payload);
  return response.data;
};

export const getScore = async (projectId) => {
  const response = await client.get(`/scoring/${projectId}`);
  return response.data;
};

export const getScoreHistory = async (projectId) => {
  const response = await client.get(`/scoring/${projectId}/history`);
  return response.data;
};

export const getScoringWeights = async () => {
  const response = await client.get('/scoring/model/weights');
  return response.data;
};

export const batchScore = async (projects) => {
  const response = await client.post('/scoring/batch', { projects });
  return response.data;
};
