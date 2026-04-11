import React from 'react';
import styles from '../styles/Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>QDL Inspired</div>
        <h1 className={styles.title}>Archival Search System</h1>
        <p className={styles.subtitle}>
          Discover and explore historical documents, maps, and manuscripts
        </p>
      </div>
    </header>
  );
};
