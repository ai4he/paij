import { useState, useEffect, useRef } from 'react';
import { Modal } from '../Common/Modal';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { useChat } from '../../hooks/useChat';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { MicButton } from '../Write/MicButton';
import * as api from '../../services/api';

export function ChatPopup({ isOpen, onClose, entry, userId }) {
  const [input, setInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    isLoading,
    error,
    isComplete,
    remainingResponses,
    sendMessage,
    startConversation,
    reset,
  } = useChat(userId);

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechSupported,
    toggleListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();

  // Start conversation when popup opens with entry
  useEffect(() => {
    if (isOpen && entry) {
      reset();
      startConversation(entry.content);
    }
  }, [isOpen, entry]);

  // Append speech transcript to input
  useEffect(() => {
    if (transcript) {
      setInput((prev) => {
        const needsSpace = prev.length > 0 && !prev.endsWith(' ');
        return prev + (needsSpace ? ' ' : '') + transcript;
      });
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Stop listening when conversation completes, popup closes, or loading
  useEffect(() => {
    if (isComplete || !isOpen || isLoading) {
      stopListening();
    }
  }, [isComplete, isOpen, isLoading, stopListening]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when not loading and not complete
  useEffect(() => {
    if (!isLoading && !isComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isComplete]);

  const handleSaveAndClose = async () => {
    if (messages.length === 0) {
      reset();
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await api.saveConversation(entry.id, userId, messages);
    } catch (err) {
      console.error('Failed to save conversation:', err);
    } finally {
      setIsSaving(false);
      reset();
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isComplete) return;

    sendMessage(input.trim());
    setInput('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={!isSaving ? handleSaveAndClose : undefined}
      title="Reflect on Your Entry"
      showClose={!isSaving}
    >
      <div className="flex h-[60vh] flex-col">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {isComplete && (
            <div className="rounded-md bg-blue-50 p-4 text-center">
              <p className="text-sm font-medium text-blue-800">
                The conversation has ended.
              </p>
              <p className="mt-1 text-sm text-blue-600">
                Take a moment to review, then close when ready.
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4">
          {!isComplete ? (
            <>
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <MicButton
                  isListening={isListening}
                  isSupported={isSpeechSupported}
                  onClick={toggleListening}
                  disabled={isLoading}
                  size="small"
                />
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input + (interimTranscript ? (input ? ' ' : '') + interimTranscript : '')}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? 'Waiting for response...' : isListening ? 'Listening...' : 'Type or speak your response...'}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
              <p className="mt-2 text-center text-xs text-gray-400">
                {remainingResponses} response{remainingResponses !== 1 ? 's' : ''} remaining
              </p>
            </>
          ) : (
            <button
              onClick={handleSaveAndClose}
              disabled={isSaving}
              className="w-full rounded-lg bg-primary-600 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:bg-gray-300"
            >
              {isSaving ? 'Saving...' : 'Close & Save Conversation'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
