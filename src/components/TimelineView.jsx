import React, { useMemo } from 'react';
import { groupByCentury, getCentury, getYear } from '../utils/dateUtils';

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '2rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    fontFamily: 'Playfair Display, serif',
    color: '#1a2744',
    marginBottom: '1.5rem',
  },
  centurySection: {
    marginBottom: '2rem',
  },
  centuryLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#666',
    marginBottom: '0.75rem',
  },
  timelineBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
  },
  node: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#c9a84c',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    color: 'white',
    fontWeight: 600,
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  nodeHover: {
    transform: 'scale(1.3)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1a2744',
    color: 'white',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  docCount: {
    fontSize: '0.75rem',
    color: '#999',
    marginLeft: '0.5rem',
  },
};

export const TimelineView = ({ results, onNodeClick }) => {
  const groupedByCentury = useMemo(() => {
    return groupByCentury(results);
  }, [results]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Timeline View</h3>

      {Object.entries(groupedByCentury).map(([century, docs]) => (
        <div key={century} style={styles.centurySection}>
          <div style={styles.centuryLabel}>
            {century}
            <span style={styles.docCount}>({docs.length} documents)</span>
          </div>
          <div style={styles.timelineBar}>
            {docs.map((doc, idx) => (
              <div
                key={`${doc.id}-${idx}`}
                style={styles.node}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.3)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
                onClick={() => onNodeClick(doc.id)}
                title={doc.title}
              >
                {getYear(doc.date) ? new Date(doc.date).getFullYear().toString().slice(-2) : '?'}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
