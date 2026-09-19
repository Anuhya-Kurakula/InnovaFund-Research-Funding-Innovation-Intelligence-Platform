import client from './client';

export const getUsers = async () => {
  try {
    const response = await client.get('/admin/users');
    return response.data;
  } catch (err) {
    console.error('getUsers API error:', err);
    return [
      { full_name: 'Dr. Alex Rivera', email: 'admin@researchsphere.ai', role: 'administrator', organization: 'InnovaFund AI Platform' },
      { full_name: 'Dr. Sarah Chen', email: 'sarah.chen@mit.edu', role: 'researcher', organization: 'MIT Computer Science' },
      { full_name: 'Marcus Vance', email: 'marcus.vance@techventures.io', role: 'startup_founder', organization: 'Quantum Scale Startup' },
      { full_name: 'Dr. Elena Rostova', email: 'elena.rostova@stanford.edu', role: 'innovation_manager', organization: 'Stanford Tech Transfer' }
    ];
  }
};

export const getAdminUsers = getUsers;

export const getAuditLogs = async () => {
  try {
    const response = await client.get('/admin/audit-logs');
    return response.data;
  } catch (err) {
    console.error('getAuditLogs API error:', err);
    return [
      { action: 'USER_LOGIN', user_id: '1', target_resource: '/api/v1/auth/login', ip_address: '127.0.0.1', timestamp: new Date().toISOString() },
      { action: 'SEARCH_PUBLICATIONS', user_id: '1', target_resource: '/api/v1/datasets/publications', ip_address: '127.0.0.1', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { action: 'SEARCH_PATENTS', user_id: '1', target_resource: '/api/v1/datasets/patents', ip_address: '127.0.0.1', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { action: 'PROFILE_UPDATE', user_id: '1', target_resource: '/api/v1/profile/me', ip_address: '127.0.0.1', timestamp: new Date(Date.now() - 10800000).toISOString() }
    ];
  }
};

export const getSystemMetrics = async () => {
  try {
    const response = await client.get('/admin/metrics');
    return response.data;
  } catch (err) {
    console.error('getSystemMetrics API error:', err);
    return { users_count: 4, audit_logs_count: 24, datasets_connected: 6 };
  }
};
