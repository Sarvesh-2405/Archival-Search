import React, { useMemo } from 'react';
import { formatDate } from '../utils/dateUtils';
import { highlightText as highlightSnippet } from '../utils/searchEngine';
import styles from '../styles/ResultCard.module.css';

// Professional SVG Bookmark Icon
const BookmarkIcon = ({ filled = false, className = "" }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Professional SVG Document Icon
const DocumentIcon = ({ className = "" }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

export const ResultCard = ({ document, highlights, onViewDetails, isFavorite, onToggleFavorite, viewMode = 'grid' }) => {
  // Truncate and highlight description
  const truncatedDesc = document.description
    ? document.description.substring(0, 150) +
      (document.description.length > 150 ? '...' : '')
    : '';

  const getHighlightedTitle = useMemo(() => {
    if (!highlights || !highlights.title) {
      return document.title;
    }
    return highlightSnippet(document.title, highlights.title);
  }, [document.title, highlights]);

  const getHighlightedDescription = useMemo(() => {
    if (!truncatedDesc || !highlights || !highlights.description) {
      return truncatedDesc;
    }
    return highlightSnippet(truncatedDesc, highlights.description);
  }, [truncatedDesc, highlights]);

  // Calculate relevance score percentage
  const maxScore = 100;
  const scorePercent = document.score ? Math.min((document.score / maxScore) * 100, 100) : 0;

  return (
    <div className={styles.card} data-type={document.type}>
      <div className={styles.cardHeader}>
        <div className={styles.topBar}>
          <div className={styles.thumbnail}>
            <DocumentIcon />
          </div>
          <div className={styles.actions}>
            <button
              className={`${styles.actionButton} ${isFavorite ? styles.favorite : ''}`}
              onClick={() => onToggleFavorite && onToggleFavorite(document.id)}
              title={isFavorite ? 'Remove bookmark' : 'Bookmark this document'}
            >
              <BookmarkIcon filled={isFavorite} />
            </button>
          </div>
        </div>

        <span className={styles.typeBadge} style={{ backgroundColor: getTypeColor(document.type) }}>
          {document.type}
        </span>

        <h3 className={styles.title}>
          {getHighlightedTitle ? (
            <span dangerouslySetInnerHTML={{ __html: getHighlightedTitle }} />
          ) : (
            document.title
          )}
        </h3>

        {document.score > 0 && (
          <div className={styles.relevanceScore}>
            <span>Relevance:</span>
            <div className={styles.scoreBar}>
              <div className={styles.scoreBarFill} style={{ width: `${scorePercent}%` }} />
            </div>
            <span>{Math.round(scorePercent)}%</span>
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.meta}>
          {document.date && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Date:</span>
              <span>{formatDate(document.date)}</span>
            </div>
          )}
          {document.place && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Place:</span>
              <span>{document.place}</span>
            </div>
          )}
          {document.region && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Region:</span>
              <span>{document.region}</span>
            </div>
          )}
          {document.language && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Language:</span>
              <span>{document.language}</span>
            </div>
          )}
        </div>

        {truncatedDesc && (
          <p className={styles.description}>
            {getHighlightedDescription ? (
              <span dangerouslySetInnerHTML={{ __html: getHighlightedDescription }} />
            ) : (
              truncatedDesc
            )}
          </p>
        )}

        {document.tags && document.tags.length > 0 && (
          <div className={styles.tags}>
            {document.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className={styles.tag}>
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className={styles.tag} style={{ fontWeight: 600 }}>
                +{document.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.details}>
          {document.author && document.author !== 'Unknown' && (
            <div>
              <strong style={{ fontSize: '0.75rem' }}>Author:</strong> {document.author}
            </div>
          )}
          <div>
            <strong style={{ fontSize: '0.75rem' }}>Institution:</strong>{' '}
            <span title={document.holdingInstitution}>{document.holdingInstitution}</span>
          </div>
        </div>
        <button
          className={styles.detailsButton}
          onClick={() => onViewDetails && onViewDetails(document)}
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

// Helper function to get type color
function getTypeColor(type) {
  return '#e8c547';
}
