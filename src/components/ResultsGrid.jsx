import React from 'react';
import { ResultCard } from './ResultCard';
import { SkeletonCard } from './SkeletonCard';

const styles = {
  resultsContainer: {
    flex: 1,
  },
  resultInfo: {
    padding: '1rem 0',
    color: '#666',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1a2744',
    marginBottom: '0.5rem',
    fontFamily: 'Playfair Display, serif',
  },
  emptyText: {
    color: '#999',
    marginBottom: '1rem',
  },
  searchSuggestions: {
    textAlign: 'left',
    display: 'inline-block',
    backgroundColor: '#f5f0e8',
    padding: '1rem',
    borderRadius: '6px',
    marginTop: '1rem',
  },
  suggestionList: {
    listStylePosition: 'inside',
    color: '#666',
    fontSize: '0.9rem',
  },
};

export const ResultsGrid = ({ results, isLoading, totalResults, paginationInfo, onViewDetails, isFavorite, onToggleFavorite }) => {
  if (isLoading) {
    return (
      <div style={styles.resultsContainer}>
        <div style={styles.gridContainer}>
          {[...Array(12)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div style={styles.resultsContainer}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>
          <h3 style={styles.emptyTitle}>No Results Found</h3>
          <p style={styles.emptyText}>
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <div style={styles.searchSuggestions}>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Try searching for:</p>
            <ul style={styles.suggestionList}>
              <li>Map</li>
              <li>Painting</li>
              <li>Letter</li>
              <li>Navigation</li>
              <li>Trade</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.resultsContainer}>
      <div style={styles.resultInfo}>
        Showing {paginationInfo.startIndex}–{paginationInfo.endIndex} of{' '}
        {paginationInfo.total} results
      </div>

      <div style={styles.gridContainer}>
        {results.map((doc) => (
          <ResultCard
            key={doc.id}
            document={doc}
            highlights={doc.highlightPositions}
            onViewDetails={onViewDetails}
            isFavorite={isFavorite && isFavorite(doc.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
