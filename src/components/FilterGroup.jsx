import React, { useState } from 'react';

const styles = {
  groupContainer: {
    marginBottom: '2rem',
  },
  groupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0.5rem 0',
    userSelect: 'none',
    borderBottom: '1px solid var(--border-light)',
    marginBottom: '1rem',
  },
  groupTitle: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: 'var(--primary-navy)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  toggleIcon: (isOpen) => ({
    fontSize: '0.8rem',
    transition: 'var(--transition-fast)',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
    opacity: 0.5,
  }),
  content: (isOpen) => ({
    display: isOpen ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '0.5rem',
  }),
  option: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    backgroundColor: isActive ? 'var(--primary-navy)' : 'var(--cream-bg)',
    color: isActive ? 'white' : 'var(--text-main)',
    border: '1px solid transparent',
  }),
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    accentColor: 'var(--gold-accent)',
  },
  label: {
    cursor: 'pointer',
    fontSize: '0.875rem',
    flex: 1,
    fontWeight: 500,
  },
  count: (isActive) => ({
    fontSize: '0.75rem',
    fontWeight: 700,
    opacity: isActive ? 1 : 0.6,
  }),
};

export const FilterGroup = ({ title, options = [], onChange, selectedValues = [] }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={styles.groupContainer}>
      <div style={styles.groupHeader} onClick={() => setIsOpen(!isOpen)}>
        <span style={styles.groupTitle}>{title}</span>
        <span style={styles.toggleIcon(isOpen)}>▼</span>
      </div>

      <div style={styles.content(isOpen)}>
        {options.map((option) => {
          const isActive = selectedValues.includes(option.value);
          return (
            <label 
              key={option.value} 
              style={styles.option(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--gold-lighter)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--cream-bg)';
              }}
            >
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={isActive}
                onChange={() => onChange(option.value)}
              />
              <span style={styles.label}>{option.label}</span>
              <span style={styles.count(isActive)}>{option.count}</span>
            </label>
          );
        })}
        {options.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-lighter)', fontStyle: 'italic', padding: '0 0.5rem' }}>
            No options available
          </p>
        )}
      </div>
    </div>
  );
};
