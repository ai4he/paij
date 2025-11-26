import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getEntries } from '../../services/api';

export function HistoryTab() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadEntries();
  }, [dateFilter]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await getEntries(user.id, dateFilter || null);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestampStr) => {
    return new Date(timestampStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Journal History</h2>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading entries...</div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          {dateFilter ? 'No entries for this date.' : 'No journal entries yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {formatDate(entry.entry_date)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatTime(entry.entry_timestamp)}
                </span>
              </div>
              <p className="mb-3 text-gray-700 whitespace-pre-wrap">{entry.content}</p>
              <button
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                onClick={() => alert('View conversation - coming soon!')}
              >
                View Conversation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
