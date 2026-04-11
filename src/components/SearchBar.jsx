import React, { useCallback } from 'react';
import styles from '../styles/SearchBar.module.css';

export const SearchBar = ({
  query,
  onQueryChange,
  onSearch,
  onClear,
  filters,
  onRemoveFilter,
}) => {
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onSearch();
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
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search documents, authors, places..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className={styles.searchButton} onClick={onSearch}>
          Search
        </button>
        {(query || getActiveFilterCount() > 0) && (
          <button className={styles.clearButton} onClick={onClear}>
            Clear
          </button>
        )}
      </div>

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
