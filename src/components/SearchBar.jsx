import React, { useCallback, useRef, useState } from 'react';
import { SearchHistory } from './SearchHistory';
import styles from '../styles/SearchBar.module.css';

export const SearchBar = ({
  query,
  onQueryChange,
  onSearch,
  onClear,
  filters,
  onRemoveFilter,
  isListening,
  isSupported,
  transcript,
  startListening,
  stopListening,
  onToggleAdvancedSearch,
  history,
  savedSearches,
  onSelectQuery,
  onClearHistory,
  onSaveSearch,
  onRemoveSaved,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const searchAreaRef = useRef(null);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onSearch();
        setShowHistory(false);
      }
    },
    [onSearch]
  );

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.types?.length > 0) count += filters.types.length;
    if (filters.regions?.length > 0) count += filters.regions.length;
    if (filters.languages?.length > 0) count += filters.languages.length;
    if (filters.institutions?.length > 0) count += filters.institutions.length;
    if (filters.subjects?.length > 0) count += filters.subjects.length;
    if (filters.dateFrom !== null || filters.dateTo !== null) count += 1;
    return count;
  };

  const buildChips = () => {
    const chips = [];

    // Type filters
    if (filters.types && filters.types.length > 0) {
      filters.types.forEach((type) => {
        chips.push({
          id: `type-${type}`,
          label: `Type: ${type}`,
          onRemove: () => onRemoveFilter({ types: type }),
        });
      });
    }

    // Region filters
    if (filters.regions && filters.regions.length > 0) {
      filters.regions.forEach((region) => {
        chips.push({
          id: `region-${region}`,
          label: `Region: ${region}`,
          onRemove: () => onRemoveFilter({ regions: region }),
        });
      });
    }

    // Language filters
    if (filters.languages && filters.languages.length > 0) {
      filters.languages.forEach((lang) => {
        chips.push({
          id: `lang-${lang}`,
          label: `Language: ${lang}`,
          onRemove: () => onRemoveFilter({ languages: lang }),
        });
      });
    }

    // Institution filters
    if (filters.institutions && filters.institutions.length > 0) {
      filters.institutions.forEach((inst) => {
        chips.push({
          id: `inst-${inst}`,
          label: `Institution: ${inst.substring(0, 20)}...`,
          onRemove: () => onRemoveFilter({ institutions: inst }),
        });
      });
    }

    // Subject filters
    if (filters.subjects && filters.subjects.length > 0) {
      filters.subjects.forEach((subject) => {
        chips.push({
          id: `subject-${subject}`,
          label: `Subject: ${subject}`,
          onRemove: () => onRemoveFilter({ subjects: subject }),
        });
      });
    }

    // Date range filter
    if (filters.dateFrom !== null || filters.dateTo !== null) {
      const fromStr = filters.dateFrom !== null ? filters.dateFrom : '—';
      const toStr = filters.dateTo !== null ? filters.dateTo : '—';
      chips.push({
        id: 'date-range',
        label: `Dates: ${fromStr}–${toStr}`,
        onRemove: () => onRemoveFilter({ dateRange: true }),
      });
    }

    return chips;
  };

  const chips = buildChips();

  return (
    <div className={styles.searchContainer}>
      {/* Wrapper for positioning history dropdown */}
      <div style={{ position: 'relative' }} ref={searchAreaRef}>
        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.input}
            placeholder="Search documents, authors, places..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          />
          
          {/* Voice Search Button */}
          <button
            className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
            onClick={isListening ? stopListening : startListening}
            title={isListening ? 'Stop listening' : 'Search by voice'}
            disabled={!isSupported}
          >
            {isListening ? '🔴' : '🎙️'}
          </button>

          {/* History Button - inline in search bar */}
          <button
            className={styles.historyBtn}
            onClick={() => setShowHistory(!showHistory)}
            title="Search history"
            aria-label="Search history"
          >
            ⏱
          </button>

          <button className={styles.searchButton} onClick={() => { onSearch(); setShowHistory(false); }}>
            Search
          </button>
          {(query || getActiveFilterCount() > 0) && (
            <button className={styles.clearButton} onClick={onClear}>
              Clear
            </button>
          )}
          
          {/* Advanced Search Button */}
          <button 
            className={styles.advancedBtn}
            onClick={onToggleAdvancedSearch}
            title="Advanced Search Options"
          >
            ⚙️ Advanced
          </button>
        </div>

        {/* History Dropdown - positioned relative to search area */}
        {showHistory && (
          <div className={styles.historyDropdownWrapper}>
            <SearchHistory
              history={history}
              savedSearches={savedSearches}
              onSelectQuery={(q) => { onSelectQuery(q); setShowHistory(false); }}
              onClearHistory={() => { onClearHistory(); setShowHistory(false); }}
              onSaveSearch={onSaveSearch}
              onRemoveSaved={onRemoveSaved}
            />
          </div>
        )}
      </div>

      {/* Voice Transcript Display */}
      {isListening && (
        <div className={styles.voiceTranscript}>
          <span className={styles.voicePulse}>●</span>
          {transcript || 'Listening... speak your search query'}
        </div>
      )}

      {!isSupported && (
        <div className={styles.voiceUnsupported}>
          Voice search not supported in this browser
        </div>
      )}

      {chips.length > 0 && (
        <div className={styles.chipContainer}>
          {chips.map((chip) => (
            <div key={chip.id} className={styles.chip}>
              {chip.label}
              <span
                className={styles.chipClose}
                onClick={chip.onRemove}
                title="Remove filter"
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
