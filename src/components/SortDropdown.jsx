import React from 'react';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#333',
  },
  select: {
    padding: '0.6rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    color: '#333',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
  },
};

export const SortDropdown = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date-newest', label: 'Date: Newest First' },
    { value: 'date-oldest', label: 'Date: Oldest First' },
    { value: 'title-asc', label: 'Title: A → Z' },
    { value: 'title-desc', label: 'Title: Z → A' },
  ];

  return (
    <div style={styles.container}>
      <label style={styles.label}>Sort by:</label>
      <select
        style={styles.select}
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
