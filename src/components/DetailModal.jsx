import React from 'react';

// Professional SVG Heart Icon
const HeartIcon = ({ filled = false, className = "" }) => (
  <svg 
    width="20" 
    height="20" 
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

export const DetailModal = ({ document, onClose, onPrint, isFavorite, onToggleFavorite }) => {
  const documentTypeColors = {
    painting: '#e8c547',
    map: '#7b68ee',
    letter: '#ff6b6b',
    manuscript: '#4ecdc4',
    drawing: '#f39c12',
    photograph: '#3498db',
    diagram: '#2ecc71',
    journal: '#e74c3c',
    illustration: '#9b59b6',
    plan: '#1abc9c',
    volume: '#34495e',
    book: '#c0392b',
    document: '#16a085',
    artifact: '#d35400',
  };

  const typeColor = documentTypeColors[document.type] || '#c9a84c';

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease',
    },
    modal: {
      background: 'white',
      borderRadius: '12px',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      animation: 'slideUp 0.3s ease',
    },
    header: {
      padding: '2rem',
      borderBottom: '2px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '1rem',
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: '1.8rem',
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      color: '#1a2744',
      marginBottom: '0.5rem',
      lineHeight: 1.3,
    },
    badge: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      backgroundColor: typeColor,
      color: 'white',
      borderRadius: '6px',
      fontSize: '0.85rem',
      fontWeight: 600,
      marginTop: '0.5rem',
      textTransform: 'uppercase',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.8rem',
      cursor: 'pointer',
      color: '#999',
      padding: 0,
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },
    body: {
      padding: '2rem',
    },
    section: {
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      color: '#1a2744',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #e8d7b8',
    },
    description: {
      fontSize: '1rem',
      lineHeight: 1.8,
      color: '#666',
      marginBottom: '2rem',
    },
    metadata: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    metaItem: {
      background: '#f5f0e8',
      padding: '1.25rem',
      borderRadius: '8px',
      borderLeft: `4px solid ${typeColor}`,
    },
    metaLabel: {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: '#999',
      textTransform: 'uppercase',
      marginBottom: '0.5rem',
    },
    metaValue: {
      fontSize: '1rem',
      color: '#1a2744',
      fontWeight: 500,
      wordBreak: 'break-word',
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    tag: {
      display: 'inline-block',
      padding: '0.4rem 0.8rem',
      background: '#e8d7b8',
      color: '#1a2744',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 500,
    },
    footer: {
      padding: '1.5rem 2rem',
      borderTop: '2px solid #f0f0f0',
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      background: '#f9f9f9',
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    printButton: {
      background: '#34495e',
      color: 'white',
    },
    closeButtonFooter: {
      background: '#e0e0e0',
      color: '#333',
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.headerContent}>
            <h2 style={modalStyles.title}>{document.title}</h2>
            <div style={modalStyles.badge}>
              {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <button
              style={{
                ...modalStyles.closeButton,
                fontSize: '1.5rem',
                width: 'auto',
                padding: '0.5rem',
              }}
              onClick={() => onToggleFavorite && onToggleFavorite(document.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon filled={isFavorite} />
            </button>
            <button
              style={modalStyles.closeButton}
              onClick={onClose}
              onMouseEnter={(e) => (e.target.style.color = '#1a2744')}
              onMouseLeave={(e) => (e.target.style.color = '#999')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={modalStyles.body}>
          {/* Description */}
          {document.description && (
            <section style={modalStyles.section}>
              <h3 style={modalStyles.sectionTitle}>Description</h3>
              <p style={modalStyles.description}>{document.description}</p>
            </section>
          )}

          {/* Metadata Grid */}
          <section style={modalStyles.section}>
            <h3 style={modalStyles.sectionTitle}>Details</h3>
            <div style={modalStyles.metadata}>
              {document.date && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>📅 Date</div>
                  <div style={modalStyles.metaValue}>{document.date}</div>
                </div>
              )}
              {document.place && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>📍 Place</div>
                  <div style={modalStyles.metaValue}>{document.place}</div>
                </div>
              )}
              {document.region && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>🌍 Region</div>
                  <div style={modalStyles.metaValue}>{document.region}</div>
                </div>
              )}
              {document.language && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>🗣️ Language</div>
                  <div style={modalStyles.metaValue}>{document.language}</div>
                </div>
              )}
              {document.author && document.author !== 'Unknown' && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>✍️ Author</div>
                  <div style={modalStyles.metaValue}>{document.author}</div>
                </div>
              )}
              {document.holdingInstitution && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>🏛️ Institution</div>
                  <div style={modalStyles.metaValue}>{document.holdingInstitution}</div>
                </div>
              )}
              {document.collection && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>📚 Collection</div>
                  <div style={modalStyles.metaValue}>{document.collection}</div>
                </div>
              )}
              {document.format && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>📄 Format</div>
                  <div style={modalStyles.metaValue}>{document.format}</div>
                </div>
              )}
            </div>
          </section>

          {/* Subjects */}
          {document.subjects && document.subjects.length > 0 && (
            <section style={modalStyles.section}>
              <h3 style={modalStyles.sectionTitle}>Subjects</h3>
              <div style={modalStyles.tagContainer}>
                {document.subjects.map((subject) => (
                  <span key={subject} style={modalStyles.tag}>
                    🏷️ {subject}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Keywords */}
          {document.keywords && document.keywords.length > 0 && (
            <section style={modalStyles.section}>
              <h3 style={modalStyles.sectionTitle}>Keywords</h3>
              <div style={modalStyles.tagContainer}>
                {document.keywords.map((keyword) => (
                  <span key={keyword} style={modalStyles.tag}>
                    🔑 {keyword}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div style={modalStyles.footer}>
          <button
            style={{ ...modalStyles.button, ...modalStyles.printButton }}
            onClick={onPrint}
            onMouseEnter={(e) => (e.target.style.background = '#2c3e50')}
            onMouseLeave={(e) => (e.target.style.background = '#34495e')}
          >
            🖨️ Print
          </button>
          <button
            style={{ ...modalStyles.button, ...modalStyles.closeButtonFooter }}
            onClick={onClose}
            onMouseEnter={(e) => (e.target.style.background = '#d0d0d0')}
            onMouseLeave={(e) => (e.target.style.background = '#e0e0e0')}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
