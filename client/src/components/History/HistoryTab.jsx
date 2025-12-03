import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getEntries, getConversation } from '../../services/api';
import { Modal } from '../Common/Modal';
import { ChatMessage } from '../Chat/ChatMessage';

export function HistoryTab() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationLoading, setConversationLoading] = useState(false);

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
    // Parse the date string and display in local timezone
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestampStr) => {
    // SQLite stores timestamps in UTC, so we need to parse as UTC
    // Replace space with T and add Z to indicate UTC
    const utcTimestamp = timestampStr.replace(' ', 'T') + 'Z';
    const date = new Date(utcTimestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleViewConversation = async (entryId) => {
    setConversationLoading(true);
    try {
      const conversation = await getConversation(entryId);
      setSelectedConversation(conversation);
    } catch (err) {
      if (err.message.includes('not found')) {
        alert('No conversation found for this entry.');
      } else {
        console.error('Failed to load conversation:', err);
        alert('Failed to load conversation.');
      }
    } finally {
      setConversationLoading(false);
    }
  };

  const handleCloseConversation = () => {
    setSelectedConversation(null);
  };

  const clearFilter = () => {
    setDateFilter('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Journal History</h2>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {dateFilter && (
            <button
              onClick={clearFilter}
              className="rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
            >
              Clear
            </button>
          )}
        </div>
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
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                    Entry #{entry.entry_number}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatDate(entry.entry_date)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatTime(entry.entry_timestamp)}
                </span>
              </div>
              <p className="mb-3 text-gray-700 whitespace-pre-wrap line-clamp-4">
                {entry.content}
              </p>
              <button
                className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-gray-400"
                onClick={() => handleViewConversation(entry.id)}
                disabled={conversationLoading}
              >
                {conversationLoading ? 'Loading...' : 'View Conversation'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Conversation Modal */}
      <Modal
        isOpen={!!selectedConversation}
        onClose={handleCloseConversation}
        title="Conversation"
        showClose={true}
      >
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {selectedConversation?.messages?.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}
        </div>
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleCloseConversation}
            className="w-full rounded-lg bg-gray-100 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
