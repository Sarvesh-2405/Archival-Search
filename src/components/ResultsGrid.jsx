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
  // List view styles
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  // Gallery view styles
  galleryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  // Table view styles
  tableContainer: {
    backgroundColor: 'white',
    border: '1px solid #c9a961',
    borderRadius: '4px',
    marginBottom: '2rem',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Libre Baskerville, serif',
  },
  tableHeader: {
    background: '#f4f1de',
    borderBottom: '2px solid #c9a961',
  },
  tableHeaderCell: {
    padding: '12px 16px',
    textAlign: 'left',
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#0f1623',
    fontWeight: 500,
  },
  tableRow: {
    borderBottom: '1px solid #e8e6e1',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  tableRowHover: {
    backgroundColor: '#faf8f3',
  },
  tableCell: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#0f1623',
  },
  // Masonry view styles
  masonryContainer: {
    columns: 3,
    gap: '1rem',
    marginBottom: '2rem',
  },
  masonryItem: {
    breakInside: 'avoid',
    marginBottom: '1rem',
    display: 'inline-block',
    width: '100%',
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

export const ResultsGrid = ({ results, isLoading, totalResults, paginationInfo, onViewDetails, isFavorite, onToggleFavorite, viewMode = 'grid' }) => {
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

  // Render different view modes
  const renderResults = () => {
    switch (viewMode) {
      case 'list':
        return (
          <div style={styles.listContainer}>
            {results.map((doc) => (
              <ResultCard
                key={doc.id}
                document={doc}
                highlights={doc.highlightPositions}
                onViewDetails={onViewDetails}
                isFavorite={isFavorite && isFavorite(doc.id)}
                onToggleFavorite={onToggleFavorite}
                viewMode="list"
              />
            ))}
          </div>
        );
      
      case 'gallery':
        return (
          <div style={styles.galleryContainer}>
            {results.map((doc) => (
              <ResultCard
                key={doc.id}
                document={doc}
                highlights={doc.highlightPositions}
                onViewDetails={onViewDetails}
                isFavorite={isFavorite && isFavorite(doc.id)}
                onToggleFavorite={onToggleFavorite}
                viewMode="gallery"
              />
            ))}
          </div>
        );
      
      case 'table':
        return (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Title</th>
                  <th style={styles.tableHeaderCell}>Type</th>
                  <th style={styles.tableHeaderCell}>Date</th>
                  <th style={styles.tableHeaderCell}>Place</th>
                  <th style={styles.tableHeaderCell}>Language</th>
                  <th style={styles.tableHeaderCell}>Institution</th>
                </tr>
              </thead>
              <tbody>
                {results.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    style={styles.tableRow}
                    onClick={() => onViewDetails(doc)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#faf8f3';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={styles.tableCell}>
                      <div style={{ fontWeight: 500, marginBottom: '2px' }}>
                        {doc.title}
                      </div>
                      {doc.author && (
                        <div style={{ fontSize: '11px', color: '#8b7355' }}>
                          {doc.author}
                        </div>
                      )}
                    </td>
                    <td style={styles.tableCell}>{doc.type}</td>
                    <td style={styles.tableCell}>{doc.date}</td>
                    <td style={styles.tableCell}>{doc.place}</td>
                    <td style={styles.tableCell}>{doc.language}</td>
                    <td style={styles.tableCell}>
                      <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.holdingInstitution}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'masonry':
        return (
          <div style={styles.masonryContainer}>
            {results.map((doc) => (
              <div key={doc.id} style={styles.masonryItem}>
                <ResultCard
                  document={doc}
                  highlights={doc.highlightPositions}
                  onViewDetails={onViewDetails}
                  isFavorite={isFavorite && isFavorite(doc.id)}
                  onToggleFavorite={onToggleFavorite}
                  viewMode="masonry"
                />
              </div>
            ))}
          </div>
        );
      
      default: // grid
        return (
          <div style={styles.gridContainer}>
            {results.map((doc) => (
              <ResultCard
                key={doc.id}
                document={doc}
                highlights={doc.highlightPositions}
                onViewDetails={onViewDetails}
                isFavorite={isFavorite && isFavorite(doc.id)}
                onToggleFavorite={onToggleFavorite}
                viewMode="grid"
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div style={styles.resultsContainer}>
      <div style={styles.resultInfo}>
        Showing {paginationInfo.startIndex}–{paginationInfo.endIndex} of{' '}
        {paginationInfo.total} results
      </div>

      {renderResults()}
    </div>
  );
};
