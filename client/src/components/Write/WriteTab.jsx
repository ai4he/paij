import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createEntry } from '../../services/api';

export function WriteTab() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      await createEntry(user.id, content);
      // TODO: Open chat popup
      setContent('');
      alert('Entry saved! Chat functionality coming soon.');
    } catch (err) {
      alert('Failed to save entry: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">{today}</h2>
        <p className="mt-2 text-gray-600">
          Please write a one to two paragraph journal entry about the highlights
          and challenges that you experienced today.
        </p>
      </div>

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your journal entry..."
          className="min-h-[200px] w-full rounded-lg border border-gray-300 p-4 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-y"
          disabled={saving}
        />
        <button
          type="button"
          className="absolute bottom-4 right-4 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Speech to text (coming soon)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={!content.trim() || saving}
        className="w-full rounded-lg bg-primary-600 py-3 font-medium text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'Saving...' : 'Save Entry'}
      </button>
    </div>
  );
}
