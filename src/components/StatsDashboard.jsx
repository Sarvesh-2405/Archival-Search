import React from 'react';
import styles from '../styles/StatsDashboard.module.css';

/**
 * StatsDashboard - Statistics visualization with SVG charts
 */
export function StatsDashboard({ documents = [] }) {
  if (documents.length === 0) {
    return <div className={styles.empty}>No documents to analyze</div>;
  }

  // Calculate statistics
  const stats = calculateStats(documents);

  return (
    <div className={styles.dashboard}>
      <h2>Archive Statistics</h2>

      <div className={styles.grid}>
        {/* Type Distribution */}
        <div className={styles.card}>
          <h3>By Document Type</h3>
          <PieChart data={stats.typeDistribution} />
          <div className={styles.legend}>
            {Object.entries(stats.typeDistribution).map(([type, count]) => (
              <div key={type} className={styles.legendItem}>
                <span className={styles.dot} style={{ backgroundColor: getColor(type) }} />
                {type} ({count})
              </div>
            ))}
          </div>
        </div>

        {/* Region Distribution */}
        <div className={styles.card}>
          <h3>By Region</h3>
          <BarChart data={stats.regionDistribution} />
        </div>

        {/* Language Distribution */}
        <div className={styles.card}>
          <h3>By Language</h3>
          <BarChart data={stats.languageDistribution} />
        </div>

        {/* Institution Distribution */}
        <div className={styles.card}>
          <h3>By Institution</h3>
          <BarChart data={stats.institutionDistribution} />
        </div>

        {/* Timeline */}
        <div className={styles.card + ' ' + styles.wide}>
          <h3>Timeline</h3>
          <TimelineChart data={stats.timeline} />
        </div>

        {/* Summary Stats */}
        <div className={styles.card}>
          <h3>Summary</h3>
          <div className={styles.summaryStats}>
            <div className={styles.stat}>
              <div className={styles.label}>Total Documents</div>
              <div className={styles.value}>{documents.length}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.label}>Unique Types</div>
              <div className={styles.value}>{Object.keys(stats.typeDistribution).length}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.label}>Unique Regions</div>
              <div className={styles.value}>{Object.keys(stats.regionDistribution).length}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.label}>Unique Languages</div>
              <div className={styles.value}>{Object.keys(stats.languageDistribution).length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions

function calculateStats(documents) {
  const stats = {
    typeDistribution: {},
    regionDistribution: {},
    languageDistribution: {},
    institutionDistribution: {},
    timeline: {}
  };

  documents.forEach((doc) => {
    // Type
    if (doc.type) {
      stats.typeDistribution[doc.type] = (stats.typeDistribution[doc.type] || 0) + 1;
    }
    // Region
    if (doc.region) {
      stats.regionDistribution[doc.region] = (stats.regionDistribution[doc.region] || 0) + 1;
    }
    // Language
    if (doc.language) {
      stats.languageDistribution[doc.language] = (stats.languageDistribution[doc.language] || 0) + 1;
    }
    // Institution
    if (doc.holdingInstitution) {
      stats.institutionDistribution[doc.holdingInstitution] = (stats.institutionDistribution[doc.holdingInstitution] || 0) + 1;
    }
    // Timeline
    if (doc.date) {
      const year = doc.date.split('-')[0];
      stats.timeline[year] = (stats.timeline[year] || 0) + 1;
    }
  });

  return stats;
}

function getColor(type) {
  const colors = {
    'Letter': 'var(--gold-accent)',
    'Map': 'var(--primary-navy)',
    'Report': '#4a6fa5',
    'Diary': '#a68860',
    'Document': '#6b7280'
  };
  return colors[type] || 'var(--gold-accent)';
}

function PieChart({ data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  let angle = 0;
  const slices = Object.entries(data).map(([label, value]) => {
    const sliceAngle = (value / total) * 360;
    const startAngle = angle;
    const endAngle = angle + sliceAngle;
    angle = endAngle;

    const radius = 40;
    const start = polarToCartesian(50, 50, radius, endAngle);
    const end = polarToCartesian(50, 50, radius, startAngle);
    const large = sliceAngle > 180 ? 1 : 0;

    const path = [
      `M 50 50`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${large} 0 ${end.x} ${end.y}`,
      'Z'
    ].join(' ');

    return (
      <path key={label} d={path} fill={getColor(label)} />
    );
  });

  return (
    <svg width="120" height="120" viewBox="0 0 100 100" className={styles.chart}>
      {slices}
    </svg>
  );
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function BarChart({ data }) {
  const entries = Object.entries(data).slice(0, 5);
  const max = Math.max(...entries.map((e) => e[1]));
  const height = 120;
  const barWidth = Math.floor(100 / entries.length);

  return (
    <svg width="200" height={height} viewBox={`0 0 200 ${height}`} className={styles.chart}>
      {entries.map(([label, value], idx) => {
        const barHeight = (value / max) * (height - 20);
        const x = idx * barWidth + 5;
        const y = height - barHeight - 10;

        return (
          <g key={label}>
            <rect x={x} y={y} width={barWidth - 10} height={barHeight} fill="var(--gold-accent)" />
            <text x={x + (barWidth - 10) / 2} y={height - 3} textAnchor="middle" fontSize="10" fill="#8b7355">
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TimelineChart({ data }) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(...entries.map((e) => e[1]));
  const width = Math.max(400, entries.length * 30);
  const barWidth = 20;

  return (
    <svg width="100%" height="100" viewBox={`0 0 ${width} 100`} className={styles.chart}>
      {entries.map(([year, count], idx) => {
        const barHeight = (count / max) * 60;
        const x = idx * 30 + 10;
        const y = 80 - barHeight;

        return (
          <g key={year}>
            <rect x={x} y={y} width={barWidth} height={barHeight} fill="var(--gold-accent)" />
            <text x={x + barWidth / 2} y="95" textAnchor="middle" fontSize="10" fill="#8b7355">
              {year}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
