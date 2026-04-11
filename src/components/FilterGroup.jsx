import React, { useState } from 'react';

const styles = {
  groupContainer: {
    marginBottom: '1.5rem',
  },
  groupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0.75rem 0',
    userSelect: 'none',
  },
  groupTitle: {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#1a2744',
  },
  toggleIcon: {
    fontSize: '1.2rem',
    transition: 'transform 0.2s ease',
  },
  toggleIconOpen: {
    transform: 'rotate(180deg)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  contentHidden: {
    display: 'none',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
  },
  checkbox: {
    cursor: 'pointer',
    width: '18px',
    height: '18px',
  },
  label: {
    cursor: 'pointer',
    fontSize: '0.9rem',
    flex: 1,
  },
  count: {
    fontSize: '0.8rem',
    color: '#999',
    marginLeft: '0.5rem',
  },
};

export const FilterGroup = ({ title, options = [], onChange, selectedValues = [] }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (value) => {
    onChange(value);
  };

  return (
    <div style={styles.groupContainer}>
      <div style={styles.groupHeader} onClick={handleToggle}>
        <span style={styles.groupTitle}>{title}</span>
        <span
          style={{
            ...styles.toggleIcon,
            ...(isOpen ? styles.toggleIconOpen : {}),
          }}
        >
          ▼
        </span>
      </div>

      <div
        style={{
          ...styles.content,
          ...(isOpen ? {} : styles.contentHidden),
        }}
      >
        {options.map((option) => (
          <label key={option.value} style={styles.option}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleChange(option.value)}
            />
            <span style={styles.label}>{option.label}</span>
            <span style={styles.count}>({option.count})</span>
          </label>
        ))}
        {options.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: '#999' }}>No options available</p>
        )}
      </div>
    </div>
  );
};
