import React from 'react';
import styles from '../styles/Pagination.module.css';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;

    for (let i = 1; i <= totalPages; i += 1) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        pages.push(i);
      }
    }

    // Add ellipsis
    const result = [];
    let prev = 0;
    pages.forEach((page) => {
      if (page - prev === 2) {
        result.push(prev + 1);
      } else if (page - prev !== 1) {
        result.push('...');
      }
      result.push(page);
      prev = page;
    });

    return result;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      {pageNumbers.map((page, idx) => (
        <React.Fragment key={idx}>
          {page === '...' ? (
            <span className={styles.ellipsis}>…</span>
          ) : (
            <button
              className={`${styles.button} ${
                page === currentPage ? styles.buttonActive : ''
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>

      <div className={styles.info}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};
