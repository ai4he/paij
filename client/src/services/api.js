const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
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

export const getEntry = (id) => request(`/entries/${id}`);

// Conversations
export const getConversation = (entryId) => request(`/conversations/${entryId}`);

export const saveConversation = (entryId, userId, messages) => request('/conversations', {
  method: 'POST',
  body: JSON.stringify({ entryId, userId, messages }),
});

// Chat
export const sendMessage = (userId, messages) => request('/chat/message', {
  method: 'POST',
  body: JSON.stringify({ userId, messages }),
});
