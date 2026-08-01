import React from 'react';
import { ResultCard } from './ResultCard';
import { SkeletonCard } from './SkeletonCard';

const styles = {
  resultsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  resultInfo: {
    padding: '0 0.5rem',
    color: 'var(--text-light)',
    fontSize: '0.95rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  galleryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  tableContainer: {
    backgroundColor: 'white',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '2rem',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-premium)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    background: 'var(--cream-bg)',
    borderBottom: '2px solid var(--border-light)',
  },
  tableHeaderCell: {
    padding: '1rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-lighter)',
    fontWeight: 700,
  },
  tableRow: (isHovered) => ({
    borderBottom: '1px solid var(--border-light)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    backgroundColor: isHovered ? 'var(--gold-lighter)' : 'white',
  }),
  tableCell: {
    padding: '1rem 1.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    fontWeight: 500,
  },
  masonryContainer: {
    columns: 3,
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  masonryItem: {
    breakInside: 'avoid',
    marginBottom: '1.5rem',
    display: 'inline-block',
    width: '100%',
  },
  emptyState: {
    textAlign: 'center',
    padding: '5rem 2rem',
    backgroundColor: 'white',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-premium)',
    border: '1px solid var(--border-light)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  emptyIcon: {
    fontSize: '4rem',
    filter: 'grayscale(0.5)',
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--primary-navy)',
    marginBottom: '0',
  },
  emptyText: {
    color: 'var(--text-light)',
    fontSize: '1.1rem',
    maxWidth: '400px',
    lineHeight: 1.6,
  },
  searchSuggestions: {
    textAlign: 'left',
    display: 'inline-flex',
    flexDirection: 'column',
    backgroundColor: 'var(--gold-lighter)',
    padding: '1.5rem 2rem',
    borderRadius: 'var(--radius-md)',
    gap: '0.75rem',
    border: '1px solid var(--gold-light)',
  },
  suggestionList: {
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    padding: 0,
  },
  suggestionItem: {
    background: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--gold-accent)',
    border: '1px solid var(--border-color)',
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
            We couldn't find anything matching your search. Try adjusting your terms or filters for better results.
          </p>
          <div style={styles.searchSuggestions}>
            <p style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.5rem', fontSize: '1rem' }}>
              Suggested searches:
            </p>
            <div style={styles.suggestionList}>
              {['Manuscript', 'Archival Map', 'Painting', 'Letter', 'Trade', 'Royal Diary'].map(term => (
                <div key={term} style={styles.suggestionItem}>{term}</div>
              ))}
            </div>
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
                    style={styles.tableRow(false)}
                    onClick={() => onViewDetails(doc)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--gold-lighter)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <td style={styles.tableCell}>
                      <div style={{ fontWeight: 600, color: 'var(--primary-navy)', marginBottom: '4px' }}>
                        {doc.title}
                      </div>
                      {doc.author && (
                        <div style={{ fontSize: '12px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                          {doc.author}
                        </div>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-full)', 
                        background: 'var(--cream-bg)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {doc.type}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{doc.date}</td>
                    <td style={styles.tableCell}>{doc.place}</td>
                    <td style={styles.tableCell}>{doc.language}</td>
                    <td style={styles.tableCell}>
                      <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8 }}>
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
