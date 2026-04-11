import { useState, useEffect } from 'react';

const VIEW_MODE_KEY = 'archval_view_mode';

/**
 * useViewMode - Manages document display mode (list, gallery, table, masonry)
 */
export function useViewMode(defaultMode = 'list') {
  const [viewMode, setViewMode] = useState(defaultMode);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    if (stored) setViewMode(stored);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const modes = ['list', 'gallery', 'table', 'masonry'];

  const switchMode = (mode) => {
    if (modes.includes(mode)) {
      setViewMode(mode);
    }
  };

  return { viewMode, switchMode, modes };
}
