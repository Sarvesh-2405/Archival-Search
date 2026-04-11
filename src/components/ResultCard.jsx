import React, { useMemo } from 'react';
import { formatDate, highlightText } from '../utils/dateUtils';
import { highlightText as highlightSnippet } from '../utils/searchEngine';
import styles from '../styles/ResultCard.module.css';

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

export const ResultCard = ({ document, highlights }) => {
  const icon = typeIcons[document.type] || '📑';

  // Truncate and highlight description
  const truncatedDesc = document.description
    ? document.description.substring(0, 120) +
      (document.description.length > 120 ? '...' : '')
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

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.thumbnail}>{icon}</div>
        <span className={`${styles.typeBadge} ${styles[`type_${document.type}`]}`}>
          {document.type}
        </span>
        <h3 className={styles.title}>
          {getHighlightedTitle ? (
            <span dangerouslySetInnerHTML={{ __html: getHighlightedTitle }} />
          ) : (
            document.title
          )}
        </h3>

        <div className={styles.meta}>
          {document.date && <span>📅 {formatDate(document.date)}</span>}
          {document.date && document.place && <span> • </span>}
          {document.place && <span>📍 {document.place}</span>}
          {(document.date || document.place) && document.region && <span> • </span>}
          {document.region && <span>{document.region}</span>}
        </div>

        <div className={styles.meta}>
          {document.language && <span>🌐 {document.language}</span>}
        </div>
      </div>

      <div className={styles.cardBody}>
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
              <span className={styles.tag}>+{document.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div>
          {document.author && document.author !== 'Unknown' && (
            <strong>Author:</strong>
          )}{' '}
          {document.author || 'Unknown'}
        </div>
        <div>
          <strong>Institution:</strong> {document.holdingInstitution}
        </div>
        {document.collection && (
          <div>
            <strong>Collection:</strong> {document.collection}
          </div>
        )}
      </div>
    </div>
  );
};
