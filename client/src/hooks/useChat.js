import { useState, useCallback } from 'react';
import * as api from '../services/api';

const MAX_AI_RESPONSES = 3;

export function useChat(userId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiResponseCount, setAiResponseCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const sendMessage = useCallback(async (content) => {
    if (isComplete || isLoading) return;

    const userMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendMessage(userId, updatedMessages);

      const assistantMessage = { role: 'assistant', content: response.content };
      setMessages((prev) => [...prev, assistantMessage]);

      const newCount = aiResponseCount + 1;
      setAiResponseCount(newCount);

      if (newCount >= MAX_AI_RESPONSES) {
        setIsComplete(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to get response');
      // Remove the user message if the request failed
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, userId, aiResponseCount, isComplete, isLoading]);

  const startConversation = useCallback(async (journalEntry) => {
    // Reset state for new conversation
    setMessages([]);
    setAiResponseCount(0);
    setIsComplete(false);
    setError(null);

    // Send the journal entry as the first message
    const userMessage = { role: 'user', content: journalEntry };
    setMessages([userMessage]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(userId, [userMessage]);

      const assistantMessage = { role: 'assistant', content: response.content };
      setMessages([userMessage, assistantMessage]);
      setAiResponseCount(1);

      if (1 >= MAX_AI_RESPONSES) {
        setIsComplete(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to start conversation');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const reset = useCallback(() => {
    setMessages([]);
    setAiResponseCount(0);
    setIsComplete(false);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    aiResponseCount,
    isComplete,
    remainingResponses: MAX_AI_RESPONSES - aiResponseCount,
    sendMessage,
    startConversation,
    reset,
  };
}
