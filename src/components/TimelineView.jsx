import React, { useState, useMemo, useRef, useCallback } from 'react';

const ERAS = [
  { name: 'Ancient', startYear: -3000, endYear: 999 },
  { name: 'Medieval', startYear: 1000, endYear: 1499 },
  { name: 'Early Modern', startYear: 1500, endYear: 1799 },
  { name: 'Colonial', startYear: 1800, endYear: 1899 },
  { name: 'Modern', startYear: 1900, endYear: 1999 },
  { name: 'Contemporary', startYear: 2000, endYear: new Date().getFullYear() }
];

const TYPE_COLORS = {
  'Letter': 'var(--gold-accent)',
  'Map': 'var(--gold-accent)',
  'Report': 'var(--gold-accent)',
  'Diary': 'var(--gold-accent)',
  'Document': 'var(--gold-accent)'
};

const styles = {
  container: {
    backgroundColor: 'var(--color-parchment, #f4f1de)',
    border: '2px solid #8b7355',
    borderRadius: '0',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '-4px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontFamily: 'Cinzel, serif',
    fontSize: '18px',
    color: 'var(--primary-navy, #0f1623)',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  eraTabs: {
    display: 'flex',
    gap: '0',
    marginBottom: '1rem',
    borderBottom: '2px solid #c9a961',
  },
  eraTab: {
    flex: '1',
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    fontFamily: 'Cinzel, serif',
    fontSize: '11px',
    color: '#8b7355',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s',
  },
  eraTabActive: {
    color: 'var(--primary-navy, #0f1623)',
    borderBottomColor: 'var(--color-gold, #d4af37)',
  },
  timelineContainer: {
    position: 'relative',
    marginBottom: '1rem',
  },
  timelineSvg: {
    width: '100%',
    height: '120px',
    cursor: 'grab',
  },
  timelineSvgDragging: {
    cursor: 'grabbing',
  },
  zoomControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center',
    marginTop: '0.5rem',
  },
  zoomBtn: {
    background: '#8b7355',
    color: 'white',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomLevel: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: '#8b7355',
    minWidth: '40px',
    textAlign: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1a2744',
    color: 'white',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    fontSize: '11px',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    pointerEvents: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  timelineCluster: {
    cursor: 'pointer',
  },
  documentCards: {
    marginTop: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  documentCard: {
    background: 'white',
    border: '1px solid #c9a961',
    padding: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  documentCardHover: {
    borderColor: 'var(--color-gold, #d4af37)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  documentTitle: {
    fontFamily: 'Cinzel, serif',
    fontSize: '14px',
    color: 'var(--primary-navy, #0f1623)',
    marginBottom: '0.5rem',
  },
  documentMeta: {
    fontSize: '12px',
    color: '#8b7355',
    marginBottom: '0.25rem',
  },
};

export const TimelineView = ({ results, onNodeClick }) => {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [selectedEra, setSelectedEra] = useState(ERAS[2]); // Default to Early Modern
  const [hoveredDoc, setHoveredDoc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const svgRef = useRef(null);

  // Filter documents by selected era
  const eraDocuments = useMemo(() => {
    return results.filter(doc => {
      const year = parseInt(doc.date?.split('-')[0]);
      return year && year >= selectedEra.startYear && year <= selectedEra.endYear;
    });
  }, [results, selectedEra]);

  // Calculate year range
  const allYears = useMemo(() => {
    return eraDocuments.map(d => parseInt(d.date?.split('-')[0])).filter(Boolean);
  }, [eraDocuments]);

  const minYear = useMemo(() => Math.min(...allYears), [allYears]);
  const maxYear = useMemo(() => Math.max(...allYears), [allYears]);
  const yearRange = Math.max((maxYear - minYear) / zoom, 1);
  const visibleMin = minYear + panOffset;
  const visibleMax = visibleMin + yearRange;

  // Cluster documents
  const clustered = useMemo(() => {
    const clusterThreshold = zoom < 3 ? 10 : zoom < 6 ? 3 : 1;
    const clusters = [];
    
    eraDocuments.forEach(doc => {
      const year = parseInt(doc.date?.split('-')[0]);
      if (!year) return;
      
      // Find existing cluster within threshold
      const existingCluster = clusters.find(c => Math.abs(c.year - year) <= clusterThreshold);
      if (existingCluster) {
        existingCluster.documents.push(doc);
        existingCluster.count++;
      } else {
        clusters.push({
          year,
          count: 1,
          documents: [doc],
          type: doc.type
        });
      }
    });
    
    return clusters.sort((a, b) => a.year - b.year);
  }, [eraDocuments, zoom]);

  // Convert year to X position
  const yearToX = useCallback((year) => {
    if (yearRange <= 0) return 50;
    const width = 800; // SVG width
    const padding = 40;
    const availableWidth = width - (padding * 2);
    const position = ((year - visibleMin) / yearRange) * availableWidth + padding;
    return Math.max(padding, Math.min(width - padding, position));
  }, [visibleMin, yearRange]);

  // Handle wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => Math.max(1, Math.min(10, z - e.deltaY * 0.01)));
  }, []);

  // Handle mouse drag
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStart;
    const yearDelta = (delta / 800) * yearRange;
    setPanOffset(prev => Math.max(minYear - visibleMin, Math.min(maxYear - visibleMax, prev - yearDelta)));
    setDragStart(e.clientX);
  }, [isDragging, dragStart, yearRange, minYear, visibleMin, maxYear, visibleMax]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Jump to era
  const jumpToEra = useCallback((era) => {
    setSelectedEra(era);
    setPanOffset(0);
    setZoom(1);
  }, []);

  // Handle cluster click
  const handleClusterClick = useCallback((cluster) => {
    if (cluster.count === 1) {
      onNodeClick(cluster.documents[0].id);
    } else {
      setSelectedDocuments(cluster.documents);
    }
  }, [onNodeClick]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Advanced Timeline View</h3>
      
      {/* Era Tabs */}
      <div style={styles.eraTabs}>
        {ERAS.map(era => (
          <button
            key={era.name}
            style={{
              ...styles.eraTab,
              ...(selectedEra.name === era.name ? styles.eraTabActive : {})
            }}
            onClick={() => jumpToEra(era)}
          >
            {era.name}
          </button>
        ))}
      </div>

      {/* Timeline Container */}
      <div style={styles.timelineContainer}>
        <svg
          ref={svgRef}
          style={{
            ...styles.timelineSvg,
            ...(isDragging ? styles.timelineSvgDragging : {})
          }}
          viewBox="0 0 800 120"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Main timeline bar */}
          <line x1="40" y1="60" x2="760" y2="60" stroke="#c9a84c" strokeWidth="2" />
          
          {/* Year markers */}
          {[Math.floor(visibleMin), Math.floor(visibleMax)].map((year, i) => (
            <g key={year}>
              <line
                x1={yearToX(year)}
                y1="55"
                x2={yearToX(year)}
                y2="65"
                stroke="#c9a84c"
                strokeWidth="1"
              />
              <text
                x={yearToX(year)}
                y="80"
                textAnchor="middle"
                fontSize="10"
                fill="#8b7355"
                fontFamily="Cinzel, serif"
              >
                {year}
              </text>
            </g>
          ))}
          
          {/* Document clusters */}
          {clustered.map((cluster, i) => (
            <g
              key={i}
              style={styles.timelineCluster}
              transform={`translate(${yearToX(cluster.year)}, 60)`}
              onMouseEnter={() => setHoveredDoc(cluster)}
              onMouseLeave={() => setHoveredDoc(null)}
              onClick={() => handleClusterClick(cluster)}
            >
              <circle
                r={cluster.count > 1 ? 12 : 6}
                fill={cluster.count > 1 ? '#8b6914' : (TYPE_COLORS[cluster.type] || '#8b7355')}
                stroke="#c9a84c"
                strokeWidth="1"
              />
              {cluster.count > 1 && (
                <text
                  y="4"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="Cinzel, serif"
                  fill="#fdf6e3"
                >
                  {cluster.count}
                </text>
              )}
            </g>
          ))}
          
          {/* Hover tooltip */}
          {hoveredDoc && (
            <foreignObject
              x={Math.max(0, Math.min(640, yearToX(hoveredDoc.year) - 80))}
              y="5"
              width="160"
              height="50"
            >
              <div style={styles.tooltip}>
                <strong>{hoveredDoc.count > 1 ? `${hoveredDoc.count} documents` : hoveredDoc.documents[0].title}</strong>
                <div>{hoveredDoc.year}</div>
              </div>
            </foreignObject>
          )}
        </svg>
        
        {/* Zoom Controls */}
        <div style={styles.zoomControls}>
          <button
            style={styles.zoomBtn}
            onClick={() => setZoom(z => Math.min(10, z * 1.5))}
          >
            +
          </button>
          <span style={styles.zoomLevel}>{Math.round(zoom * 10) / 10}×</span>
          <button
            style={styles.zoomBtn}
            onClick={() => setZoom(z => Math.max(1, z / 1.5))}
          >
            −
          </button>
        </div>
      </div>

      {/* Selected Documents */}
      {selectedDocuments.length > 0 && (
        <div style={styles.documentCards}>
          <h4 style={styles.title}>Selected Documents ({selectedDocuments.length})</h4>
          {selectedDocuments.map(doc => (
            <div
              key={doc.id}
              style={styles.documentCard}
              onClick={() => onNodeClick(doc.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gold, #d4af37)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#c9a961';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={styles.documentTitle}>{doc.title}</div>
              <div style={styles.documentMeta}>Type: {doc.type}</div>
              <div style={styles.documentMeta}>Date: {doc.date}</div>
              <div style={styles.documentMeta}>Place: {doc.place}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
