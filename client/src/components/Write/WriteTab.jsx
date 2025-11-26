import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { createEntry } from '../../services/api';
import { MicButton } from './MicButton';
import { ChatPopup } from '../Chat/ChatPopup';

export function WriteTab() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedEntry, setSavedEntry] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    toggleListening,
    resetTranscript,
  } = useSpeechToText();

  // Append transcript to content when speech is captured
  useEffect(() => {
    if (transcript) {
      setContent((prev) => {
        const separator = prev && !prev.endsWith(' ') ? ' ' : '';
        return prev + separator + transcript;
      });
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSave = async () => {
    if (!content.trim()) return;

    // Stop listening if recording
    if (isListening) {
      toggleListening();
    }

    setSaving(true);
    try {
      const entry = await createEntry(user.id, content);
      setSavedEntry(entry);
      setContent('');
      setShowChat(true);
    } catch (err) {
      alert('Failed to save entry: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChatClose = () => {
    setShowChat(false);
    setSavedEntry(null);
  };

  // Display content with interim transcript preview
  const displayContent = content + (interimTranscript ? (content && !content.endsWith(' ') ? ' ' : '') + interimTranscript : '');

  // Character count
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">{today}</h2>
        <p className="mt-2 text-gray-600">
          Please write a one to two paragraph journal entry about the highlights
          and challenges that you experienced today.
        </p>
      </div>

      {/* Journal Entry Area */}
      <div className="relative">
        <textarea
          value={displayContent}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your journal entry..."
          className={`min-h-[250px] w-full rounded-lg border p-4 pb-16 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 resize-y transition-colors ${
            isListening
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
          }`}
          disabled={saving}
        />

        {/* Bottom toolbar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {/* Character/word count */}
          <div className="text-xs text-gray-400">
            {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} chars
          </div>

          {/* Recording indicator + mic button */}
          <div className="flex items-center gap-2">
            {isListening && (
              <span className="flex items-center gap-1 text-xs text-red-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
                Recording...
              </span>
            )}
            <MicButton
              isListening={isListening}
              isSupported={isSupported}
              onClick={toggleListening}
              disabled={saving}
            />
          </div>
        </div>
      </div>

      {/* Interim transcript preview */}
      {interimTranscript && (
        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-500 italic">
          Hearing: &ldquo;{interimTranscript}&rdquo;
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!content.trim() || saving}
        className="w-full rounded-lg bg-primary-600 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Saving...
          </span>
        ) : (
          'Save Entry'
        )}
      </button>

      {/* Speech-to-text hint */}
      {isSupported && !content && (
        <p className="text-center text-sm text-gray-400">
          Tip: Click the microphone button to dictate your entry
        </p>
      )}

      {/* Chat Popup */}
      <ChatPopup
        isOpen={showChat}
        onClose={handleChatClose}
        entry={savedEntry}
        userId={user?.id}
      />
    </div>
  );
}
