import React from 'react';
import styles from '../styles/ViewMode.module.css';

/**
 * ViewModeToggle - Switch between list, gallery, table, and masonry views
 */
export function ViewModeToggle({ currentMode, onModeChange }) {
  const modes = [
    { id: 'list', icon: '☰', label: 'List' },
    { id: 'gallery', icon: '⊞', label: 'Gallery' },
    { id: 'table', icon: '⊞⊞', label: 'Table' },
    { id: 'masonry', icon: '⚬', label: 'Masonry' }
  ];

  return (
    <div className={styles.toggle}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`${styles.btn} ${currentMode === mode.id ? styles.active : ''}`}
          title={mode.label}
        >
          {mode.icon}
        </button>
      ))}
    </div>
  );
}
