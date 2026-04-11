import React, { useMemo } from 'react';
import { formatDate } from '../utils/dateUtils';
import { highlightText as highlightSnippet } from '../utils/searchEngine';
import styles from '../styles/ResultCard.module.css';

// Professional SVG Icons
const HeartIcon = ({ filled = false, className = "" }) => (
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
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const EyeIcon = ({ className = "" }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// Type-specific emoji icons
const typeIcons = {
  painting: '🖼️',
  map: '🗺️',
  letter: '✉️',
  manuscript: '📜',
  drawing: '✏️',
  photograph: '📷',
  diagram: '📊',
  journal: '📓',
  illustration: '🎨',
  plan: '📐',
  volume: '📕',
  book: '📖',
  document: '📄',
  artifact: '🏺',
};

export const ResultCard = ({ document, highlights, onViewDetails, isFavorite, onToggleFavorite, viewMode = 'grid' }) => {
  const icon = typeIcons[document.type] || '📑';

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
          <div className={styles.thumbnail}>{icon}</div>
          <div className={styles.actions}>
            <button
              className={`${styles.actionButton} ${isFavorite ? styles.favorite : ''}`}
              onClick={() => onToggleFavorite && onToggleFavorite(document.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon filled={isFavorite} />
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onViewDetails && onViewDetails(document)}
              title="View full details"
            >
              <EyeIcon />
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
