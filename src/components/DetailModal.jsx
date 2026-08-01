import React, { useState } from 'react';
import { analyzeDocumentWithGemini } from '../utils/geminiService';

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
  const typeColor = 'var(--gold-accent)';
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleGenerateAIInsights = async () => {
    setLoadingAI(true);
    setAiError(null);
    try {
      const analysis = await analyzeDocumentWithGemini(document);
      setAiAnalysis(analysis);
    } catch (error) {
      setAiError(error.message || 'Failed to generate AI insights. Please check your API key and try again.');
      console.error(error);
    } finally {
      setLoadingAI(false);
    }
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 22, 35, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem',
    },
    modal: {
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid var(--border-light)',
      animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    header: {
      padding: '2.5rem',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '2rem',
      backgroundColor: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 2,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: '2.5rem',
      fontFamily: 'Playfair Display, serif',
      fontWeight: '700',
      color: 'var(--primary-navy)',
      marginBottom: '1rem',
      lineHeight: 1.2,
    },
    typeBadge: {
      display: 'inline-flex',
      padding: '0.4rem 1rem',
      backgroundColor: typeColor,
      color: 'white',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    actionBtn: (isActive) => ({
      width: '44px',
      height: '44px',
      borderRadius: 'var(--radius-full)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-fast)',
      background: isActive ? '#fee2e2' : 'var(--border-light)',
      color: isActive ? '#ef4444' : 'var(--text-light)',
    }),
    closeButton: {
      width: '44px',
      height: '44px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--border-light)',
      color: 'var(--text-main)',
      fontSize: '1.25rem',
    },
    body: {
      padding: '2.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    sectionTitle: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: 'var(--text-lighter)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    sectionTitleLine: {
      flex: 1,
      height: '1px',
      background: 'var(--border-light)',
    },
    description: {
      fontSize: '1.1rem',
      lineHeight: 1.8,
      color: 'var(--text-main)',
      fontFamily: 'Inter, sans-serif',
      padding: '1.5rem',
      background: 'var(--cream-bg)',
      borderRadius: 'var(--radius-md)',
      borderLeft: `4px solid ${typeColor}`,
    },
    metadataGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.5rem',
    },
    metaItem: {
      padding: '1.25rem',
      background: 'white',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      transition: 'var(--transition-fast)',
    },
    metaLabel: {
      fontSize: '0.7rem',
      fontWeight: 700,
      color: 'var(--text-lighter)',
      textTransform: 'uppercase',
    },
    metaValue: {
      fontSize: '1rem',
      color: 'var(--primary-navy)',
      fontWeight: 600,
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
    },
    tag: {
      padding: '0.5rem 1.25rem',
      background: 'var(--gold-lighter)',
      color: 'var(--gold-accent)',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.875rem',
      fontWeight: 600,
      border: '1px solid var(--gold-light)',
    },
    footerStatus: {
      padding: '1.5rem 2.5rem',
      background: 'var(--cream-bg)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
    },
    primaryBtn: {
      padding: '0.875rem 2rem',
      background: 'var(--primary-navy)',
      color: 'white',
      borderRadius: 'var(--radius-md)',
      fontSize: '1rem',
    },
    secondaryBtn: {
      padding: '0.875rem 2rem',
      background: 'white',
      color: 'var(--text-main)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      fontSize: '1rem',
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.headerContent}>
            <div style={modalStyles.typeBadge}>
              {document.type}
            </div>
            <h2 style={modalStyles.title}>{document.title}</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              style={modalStyles.actionBtn(isFavorite)}
              onClick={() => onToggleFavorite && onToggleFavorite(document.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon filled={isFavorite} />
            </button>
            <button
              style={modalStyles.closeButton}
              onClick={onClose}
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={modalStyles.body}>
          {/* Description */}
          {document.description && (
            <div style={modalStyles.section}>
              <div style={modalStyles.sectionTitle}>
                <span style={{ fontSize: '1.2rem' }}>📖</span> Description
                <div style={modalStyles.sectionTitleLine}></div>
              </div>
              <p style={modalStyles.description}>{document.description}</p>
            </div>
          )}

          {/* Metadata Grid */}
          <div style={modalStyles.section}>
            <div style={modalStyles.sectionTitle}>
              <span style={{ fontSize: '1.2rem' }}>🧾</span> Archival Details
              <div style={modalStyles.sectionTitleLine}></div>
            </div>
            <div style={modalStyles.metadataGrid}>
              {document.date && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>📅 Date Created</div>
                  <div style={modalStyles.metaValue}>{document.date}</div>
                </div>
              )}
              {document.place && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>📍 Geographic Place</div>
                  <div style={modalStyles.metaValue}>{document.place}</div>
                </div>
              )}
              {document.region && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>🌍 Regional Origin</div>
                  <div style={modalStyles.metaValue}>{document.region}</div>
                </div>
              )}
              {document.language && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>🗣️ Document Language</div>
                  <div style={modalStyles.metaValue}>{document.language}</div>
                </div>
              )}
              {document.author && document.author !== 'Unknown' && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>✍️ Recorded Author</div>
                  <div style={modalStyles.metaValue}>{document.author}</div>
                </div>
              )}
              {document.holdingInstitution && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>🏛️ Holding Institution</div>
                  <div style={modalStyles.metaValue}>{document.holdingInstitution}</div>
                </div>
              )}
              {document.collection && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>📚 Archival Collection</div>
                  <div style={modalStyles.metaValue}>{document.collection}</div>
                </div>
              )}
              {document.format && (
                <div style={modalStyles.metaItem}>
                  <div style={modalStyles.metaLabel}>📄 Physical Format</div>
                  <div style={modalStyles.metaValue}>{document.format}</div>
                </div>
              )}
            </div>
          </div>

          {/* Subjects */}
          {document.subjects && document.subjects.length > 0 && (
            <div style={modalStyles.section}>
              <div style={modalStyles.sectionTitle}>
                <span style={{ fontSize: '1.2rem' }}>🏷️</span> Subjects & Classifications
                <div style={modalStyles.sectionTitleLine}></div>
              </div>
              <div style={modalStyles.tagContainer}>
                {document.subjects.map((subject) => (
                  <span key={subject} style={modalStyles.tag}>
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {document.keywords && document.keywords.length > 0 && (
            <div style={modalStyles.section}>
              <div style={modalStyles.sectionTitle}>
                <span style={{ fontSize: '1.2rem' }}>🔑</span> Metadata Keywords
                <div style={modalStyles.sectionTitleLine}></div>
              </div>
              <div style={modalStyles.tagContainer}>
                {document.keywords.map((keyword) => (
                  <span key={keyword} style={modalStyles.tag}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights Section */}
          <div style={modalStyles.section}>
            <div style={modalStyles.sectionTitle}>
              <span style={{ fontSize: '1.2rem' }}>🤖</span> AI-Powered Insights
              <div style={modalStyles.sectionTitleLine}></div>
            </div>

            {!aiAnalysis && !loadingAI && !aiError && (
              <button
                onClick={handleGenerateAIInsights}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'var(--gold-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--gold-light)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--gold-accent)';
                }}
              >
                ✨ Generate AI Insights
              </button>
            )}

            {loadingAI && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--cream-bg)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>Analyzing document with AI...</p>
                <div style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  border: '3px solid var(--gold-lighter)',
                  borderTop: '3px solid var(--gold-accent)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              </div>
            )}

            {aiError && (
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #fca5a5',
              }}>
                <p style={{ marginBottom: '0.75rem' }}>{aiError}</p>
                <button
                  onClick={handleGenerateAIInsights}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {aiAnalysis && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Summary */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--cream-bg)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--gold-accent)',
                }}>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-lighter)',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    letterSpacing: '0.05em',
                  }}>📋 Summary</h4>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>
                    {aiAnalysis.summary}
                  </p>
                </div>

                {/* Historical Context */}
                {aiAnalysis.historicalContext && (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--cream-bg)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--gold-accent)',
                  }}>
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--text-lighter)',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                      letterSpacing: '0.05em',
                    }}>📚 Historical Context</h4>
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {aiAnalysis.historicalContext}
                    </p>
                  </div>
                )}

                {/* Key Insights */}
                {aiAnalysis.keyInsights && aiAnalysis.keyInsights.length > 0 && (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--cream-bg)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--gold-accent)',
                  }}>
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--text-lighter)',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                      letterSpacing: '0.05em',
                    }}>💡 Key Insights</h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}>
                      {aiAnalysis.keyInsights.map((insight, index) => (
                        <li key={index} style={{
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          borderRadius: '0.375rem',
                          borderLeft: '3px solid var(--gold-accent)',
                          color: 'var(--text-main)',
                        }}>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Related Topics */}
                {aiAnalysis.suggestedRelatedTopics && aiAnalysis.suggestedRelatedTopics.length > 0 && (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--cream-bg)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--gold-accent)',
                  }}>
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--text-lighter)',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                      letterSpacing: '0.05em',
                    }}>🔗 Related Topics</h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}>
                      {aiAnalysis.suggestedRelatedTopics.map((topic, index) => (
                        <span key={index} style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'white',
                          color: 'var(--gold-accent)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          border: '1px solid var(--gold-light)',
                        }}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Research Value */}
                {aiAnalysis.researchValue && (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--cream-bg)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--gold-accent)',
                  }}>
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--text-lighter)',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                      letterSpacing: '0.05em',
                    }}>🎓 Research Value</h4>
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {aiAnalysis.researchValue}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setAiAnalysis(null);
                    setAiError(null);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--border-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                  }}
                >
                  Clear Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={modalStyles.footerStatus}>
          <button
            style={modalStyles.secondaryBtn}
            onClick={onPrint}
            onMouseEnter={(e) => (e.target.style.background = 'var(--border-light)')}
            onMouseLeave={(e) => (e.target.style.background = 'white')}
          >
            🖨️ Print Document
          </button>
          <button
            style={modalStyles.primaryBtn}
            onClick={onClose}
            onMouseEnter={(e) => (e.target.style.background = 'var(--primary-navy-dark)')}
            onMouseLeave={(e) => (e.target.style.background = 'var(--primary-navy)')}
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
