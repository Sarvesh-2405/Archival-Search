import { useState, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'archval_search_history';
const SAVED_SEARCHES_KEY = 'archval_saved_searches';
const MAX_HISTORY = 20;

/**
 * useSearchHistory - Manages recent searches and saved search bookmarks
 */
export function useSearchHistory() {
  const [history, setHistory] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    const storedSaved = localStorage.getItem(SAVED_SEARCHES_KEY);
    if (stored) setHistory(JSON.parse(stored));
    if (storedSaved) setSavedSearches(JSON.parse(storedSaved));
  }, []);

  const addToHistory = (query) => {
    const newHistory = [
      { query, timestamp: Date.now() },
      ...history.filter((h) => h.query !== query)
    ].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const saveSearch = (query, name) => {
    const newSave = { id: Date.now(), query, name, savedAt: Date.now() };
    const updated = [...savedSearches, newSave];
    setSavedSearches(updated);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
    return newSave;
  };

  const removeSavedSearch = (id) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
  };

  return {
    history,
    addToHistory,
    clearHistory,
    savedSearches,
    saveSearch,
    removeSavedSearch
  };
}
