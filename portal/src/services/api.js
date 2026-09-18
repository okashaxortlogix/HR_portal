/**
 * XortLogix Portal - Laravel REST API Service
 * Communicates with the PHP Laravel backend via /api endpoints
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API [${endpoint}] error:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication & Profile
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  updateProfile: (profileData) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  // Users Directory
  getUsers: () => request('/users'),
  createUser: (userData) => request('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  updateUser: (id, userData) => request(`/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  deleteUser: (id) => request(`/users/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }),

  // Leave Policies
  getPolicies: () => request('/policies'),
  savePolicy: (policyData) => request('/policies', {
    method: 'POST',
    body: JSON.stringify(policyData)
  }),
  deletePolicy: (id) => request(`/policies/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }),

  // Leave Requests & Workflow
  getLeaves: () => request('/leaves'),
  applyLeave: (leaveData) => request('/leaves', {
    method: 'POST',
    body: JSON.stringify(leaveData)
  }),
  actionLeave: (id, action, approver, reason) => request(`/leaves/${encodeURIComponent(id)}/action`, {
    method: 'PUT',
    body: JSON.stringify({ action, approver, reason })
  }),

  // Announcements Broadcast
  getAnnouncements: () => request('/announcements'),
  createAnnouncement: (announcementData) => request('/announcements', {
    method: 'POST',
    body: JSON.stringify(announcementData)
  }),
  deleteAnnouncement: (id) => request(`/announcements/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }),

  // Helpdesk Tickets
  getTickets: () => request('/tickets'),
  createTicket: (ticketData) => request('/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData)
  }),
  updateTicketStatus: (id, status, actor_name) => request(`/tickets/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, actor_name })
  }),

  // Audit Logs
  getAuditLogs: () => request('/audit-logs'),
};

export default api;
