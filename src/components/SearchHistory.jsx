import React, { useState } from 'react';
import styles from '../styles/SearchHistory.module.css';

/**
 * SearchHistory - Dropdown showing recent searches and saved searches
 * Rendered directly (trigger button is in SearchBar)
 */
export function SearchHistory({ history = [], savedSearches = [], onSelectQuery, onClearHistory, onSaveSearch, onRemoveSaved }) {
  const [tab, setTab] = useState('recent');

  const handleSaveSearch = (query) => {
    const name = prompt('Save this search as:', query);
    if (name) {
      onSaveSearch(query, name);
    }
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'recent' ? styles.active : ''}`}
          onClick={() => setTab('recent')}
        >
          Recent ({history.length})
        </button>
        <button
          className={`${styles.tab} ${tab === 'saved' ? styles.active : ''}`}
          onClick={() => setTab('saved')}
        >
          Saved ({savedSearches.length})
        </button>
      </div>

      {tab === 'recent' && (
        <div className={styles.list}>
          {history.length === 0 ? (
            <p className={styles.empty}>No recent searches</p>
          ) : (
            <>
              {history.map((h, idx) => (
                <div key={idx} className={styles.item}>
                  <button
                    className={styles.query}
                    onClick={() => onSelectQuery(h.query)}
                  >
                    {h.query}
                  </button>
                  <button
                    className={styles.save}
                    onClick={() => handleSaveSearch(h.query)}
                    title="Save this search"
                  >
                    ♡
                  </button>
                </div>
              ))}
              <button
                className={styles.clearBtn}
                onClick={onClearHistory}
              >
                Clear History
              </button>
            </>
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div className={styles.list}>
          {savedSearches.length === 0 ? (
            <p className={styles.empty}>No saved searches</p>
          ) : (
            savedSearches.map((s) => (
              <div key={s.id} className={styles.item}>
                <div>
                  <div className={styles.savedName}>{s.name}</div>
                  <div className={styles.savedQuery}>{s.query}</div>
                </div>
                <button
                  className={styles.use}
                  onClick={() => onSelectQuery(s.query)}
                  title="Use this search"
                >
                  →
                </button>
                <button
                  className={styles.remove}
                  onClick={() => onRemoveSaved(s.id)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
