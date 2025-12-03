const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Auth
export const login = (pin) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ pin }),
});

export const register = () => request('/auth/register', {
  method: 'POST',
});

// Entries
export const getEntries = (userId, date = null) => {
  const params = new URLSearchParams({ userId });
  if (date) params.append('date', date);
  return request(`/entries?${params}`);
};

export const createEntry = (userId, content) => request('/entries', {
  method: 'POST',
  body: JSON.stringify({ userId, content }),
});

export const getEntry = (id, userId) => request(`/entries/${id}?userId=${userId}`);

// Conversations
export const getConversation = (entryId, userId) => request(`/conversations/${entryId}?userId=${userId}`);

export const saveConversation = (entryId, userId, messages) => request('/conversations', {
  method: 'POST',
  body: JSON.stringify({ entryId, userId, messages }),
});

// Chat
export const sendMessage = (userId, messages) => request('/chat/message', {
  method: 'POST',
  body: JSON.stringify({ userId, messages }),
});

// Admin
export const getAdminUsers = (adminKey) => request('/admin/users', {
  headers: { 'X-Admin-Key': adminKey },
});

export const updatePrompts = (adminKey, userIds, systemPrompt) => request('/admin/prompts', {
  method: 'PUT',
  headers: { 'X-Admin-Key': adminKey },
  body: JSON.stringify({ userIds, systemPrompt }),
});

export const getAdminEntries = (adminKey, userIds) => request(`/admin/entries?userIds=${userIds.join(',')}`, {
  headers: { 'X-Admin-Key': adminKey },
});

export const deleteAdminEntries = (adminKey, { entryIds, userIds, deleteAll }) => request('/admin/entries', {
  method: 'DELETE',
  headers: { 'X-Admin-Key': adminKey },
  body: JSON.stringify({ entryIds, userIds, deleteAll }),
});
