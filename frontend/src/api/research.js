import client from './client';

export const searchPublications = async (query = 'artificial intelligence', source = 'all', limit = 10) => {
  const response = await client.get('/datasets/publications/search', {
    params: { query, source, limit },
  });
  return response.data;
};

export const searchPatents = async (query = 'quantum computing', source = 'all', limit = 10) => {
  // Try /patents/search first, fallback to /datasets/patents/search
  try {
    const response = await client.get('/patents/search', {
      params: { query, source, limit },
    });
    return response.data;
  } catch (err) {
    const response = await client.get('/datasets/patents/search', {
      params: { query, source, limit },
    });
    return response.data;
  }
};

export const getPatentClusters = async (domain = null) => {
  const params = domain ? { domain } : {};
  const response = await client.get('/patents/clusters', { params });
  return response.data;
};

export const getPatentTrends = async (time_frame = 'annual') => {
  const response = await client.get('/patents/trends', { params: { time_frame } });
  return response.data;
};

export const getEmergingTechnologies = async (category = null) => {
  const params = category ? { category } : {};
  const response = await client.get('/technology/emerging', { params });
  return response.data;
};

export const getTechnologyMaturity = async (domain_name = null) => {
  const params = domain_name ? { domain_name } : {};
  const response = await client.get('/technology/maturity', { params });
  return response.data;
};

export const getTechnologyCompetitors = async (domain_name = null) => {
  const params = domain_name ? { domain_name } : {};
  const response = await client.get('/technology/competitors', { params });
  return response.data;
};
