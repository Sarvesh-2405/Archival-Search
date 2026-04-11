import React, { useState } from 'react';
import styles from '../styles/AdvancedSearch.module.css';

/**
 * AdvancedSearch - Advanced query builder with boolean operators, wildcards, phrase search
 */
export function AdvancedSearch({ onSearch, onClose }) {
  const [query, setQuery] = useState('');
  const [useBoolean, setUseBoolean] = useState(false);
  const [usePhrase, setUsePhrase] = useState(false);
  const [useWildcard, setUseWildcard] = useState(false);
  const [fieldSearch, setFieldSearch] = useState('any');
  const [showHint, setShowHint] = useState(false);

  const handleSearch = () => {
    const modes = {
      boolean: useBoolean,
      phrase: usePhrase,
      wildcard: useWildcard
    };
    onSearch(query, modes, fieldSearch);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Advanced Search</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label>Search Query</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search terms..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.section}>
            <label>Field</label>
            <select value={fieldSearch} onChange={(e) => setFieldSearch(e.target.value)} className={styles.select}>
              <option value="any">Any Field</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="author">Author</option>
              <option value="tags">Tags</option>
            </select>
          </div>

          <div className={styles.optionsGrid}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={useBoolean}
                onChange={(e) => setUseBoolean(e.target.checked)}
              />
              <span>Boolean Operators (AND/OR/NOT)</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={usePhrase}
                onChange={(e) => setUsePhrase(e.target.checked)}
              />
              <span>Phrase Search ("exact phrase")</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={useWildcard}
                onChange={(e) => setUseWildcard(e.target.checked)}
              />
              <span>Wildcards (test*)</span>
            </label>
          </div>

          <button
            className={styles.hintBtn}
            onClick={() => setShowHint(!showHint)}
            type="button"
          >
            ? Help
          </button>

          {showHint && (
            <div className={styles.hint}>
              <p><strong>Boolean:</strong> Use AND, OR, NOT (e.g., "archive AND map")</p>
              <p><strong>Phrase:</strong> Wrap in quotes (e.g., "imperial library")</p>
              <p><strong>Wildcards:</strong> Use * for partial matches (e.g., test*)</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSearch} className={styles.searchBtn}>Search</button>
        </div>
      </div>
    </div>
  );
}
