import { useState, useEffect } from 'react';
import { getAdminUsers, updatePrompts } from '../../services/api';

export function AdminPanel() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newPrompt, setNewPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await getAdminUsers(adminKey);
      setUsers(data);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message || 'Invalid admin key');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    setUsers([]);
    setSelectedUsers([]);
    setNewPrompt('');
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleUpdatePrompts = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }
    if (!newPrompt.trim()) {
      setError('Please enter a system prompt');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updatePrompts(adminKey, selectedUsers, newPrompt);
      setSuccess(`Updated ${selectedUsers.length} user(s) successfully`);

      // Refresh user list
      const data = await getAdminUsers(adminKey);
      setUsers(data);
      setSelectedUsers([]);
      setNewPrompt('');
    } catch (err) {
      setError(err.message || 'Failed to update prompts');
    } finally {
      setLoading(false);
    }
  };

  const selectedUsersPrompts = users
    .filter((u) => selectedUsers.includes(u.id))
    .map((u) => u.system_prompt);

  const allSamePrompt = selectedUsersPrompts.length > 0 &&
    selectedUsersPrompts.every((p) => p === selectedUsersPrompts[0]);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
              Admin Panel
            </h1>
            <p className="mb-6 text-center text-sm text-gray-600">
              Enter admin key to continue
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Admin Key"
                className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                disabled={loading}
              />

              {error && (
                <p className="mb-4 text-center text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !adminKey.trim()}
                className="w-full rounded-md bg-gray-800 py-3 font-medium text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Authenticating...' : 'Access Admin Panel'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Selected</p>
            <p className="text-2xl font-bold text-primary-600">{selectedUsers.length}</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-green-600">
            {success}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* User List */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Users</h2>
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {users.map((user) => (
                <label
                  key={user.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    selectedUsers.includes(user.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-gray-900">
                        {user.pin}
                      </span>
                      <span className="text-xs text-gray-400">ID: {user.id}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 truncate">
                      {user.system_prompt?.slice(0, 60)}...
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Bulk Edit System Prompt
            </h2>

            {selectedUsers.length > 0 && allSamePrompt && (
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-500">Current prompt for selected users:</p>
                <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                  {selectedUsersPrompts[0]}
                </div>
              </div>
            )}

            {selectedUsers.length > 0 && !allSamePrompt && (
              <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
                Selected users have different prompts
              </div>
            )}

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New System Prompt
              </label>
              <textarea
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Enter the new system prompt for selected users..."
                rows={6}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <button
              onClick={handleUpdatePrompts}
              disabled={loading || selectedUsers.length === 0 || !newPrompt.trim()}
              className="w-full rounded-md bg-primary-600 py-3 font-medium text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? 'Updating...'
                : `Update ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
