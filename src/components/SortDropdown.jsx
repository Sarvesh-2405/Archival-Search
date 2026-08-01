import React, { useState, useRef, useEffect } from 'react';

const styles = {
  wrapper: {
    position: 'relative',
  },
  button: (isOpen) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.6rem 1rem',
    background: isOpen ? 'var(--gold-lighter)' : 'var(--cream-bg)',
    border: `1px solid ${isOpen ? 'var(--gold-accent)' : 'var(--border-color)'}`,
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-main)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    boxShadow: isOpen ? 'var(--shadow-premium)' : 'none',
  }),
  icon: {
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    left: 0,
    zIndex: 100,
    minWidth: '200px',
    background: 'white',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    animation: 'slideUp 0.2s ease-out',
  },
  option: (isActive) => ({
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: isActive ? 'var(--primary-navy)' : 'var(--text-main)',
    backgroundColor: isActive ? 'var(--gold-lighter)' : 'transparent',
    transition: 'var(--transition-fast)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  check: {
    color: 'var(--gold-accent)',
    fontWeight: 800,
  }
};

export const SortDropdown = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance'},
    { value: 'date-newest', label: 'Newest First' },
    { value: 'date-oldest', label: 'Oldest First'},
    { value: 'title-asc', label: 'Title: A → Z' },
    { value: 'title-desc', label: 'Title: Z → A' },
  ];

  const currentOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={styles.wrapper} ref={dropdownRef}>
      <button 
        style={styles.button(isOpen)} 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = 'var(--gold-lighter)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = 'var(--cream-bg)';
        }}
      >
        <span style={styles.icon}></span>
        <span>Sorted by: <strong>{currentOption.label}</strong></span>
        <span style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '0.25rem' }}>▼</span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={{ 
            padding: '0.5rem 1rem', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--text-lighter)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '0.25rem'
          }}>
            Sort Results By
          </div>
          {sortOptions.map((option) => (
            <div
              key={option.value}
              style={styles.option(currentSort === option.value)}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                if (currentSort !== option.value) e.currentTarget.style.backgroundColor = 'var(--cream-bg)';
              }}
              onMouseLeave={(e) => {
                if (currentSort !== option.value) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>{option.icon} {option.label}</span>
              {currentSort === option.value && <span style={styles.check}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
