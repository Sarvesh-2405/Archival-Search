import React from 'react';

const skeletonStyles = {
  card: {
    background: '#f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    padding: '1.5rem',
    paddingBottom: '0.5rem',
  },
  skeleton: {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '4px',
  },
  thumbnail: {
    width: '60px',
    height: '60px',
    marginBottom: '1rem',
  },
  badge: {
    width: '80px',
    height: '20px',
    marginBottom: '0.75rem',
  },
  title: {
    width: '100%',
    height: '24px',
    marginBottom: '0.75rem',
  },
  text: {
    width: '100%',
    height: '16px',
    marginBottom: '0.5rem',
  },
  body: {
    padding: '1rem 1.5rem',
    flex: 1,
  },
  description: {
    width: '100%',
    height: '60px',
    marginBottom: '1rem',
  },
  footer: {
    padding: '0.75rem 1.5rem 1.5rem',
  },
  footerLine: {
    width: '100%',
    height: '14px',
    marginBottom: '0.5rem',
  },
};

export const SkeletonCard = () => {
  return (
    <div style={skeletonStyles.card}>
      <div style={skeletonStyles.header}>
        <div
          style={{
            ...skeletonStyles.skeleton,
            ...skeletonStyles.thumbnail,
          }}
        />
        <div
          style={{
            ...skeletonStyles.skeleton,
            ...skeletonStyles.badge,
          }}
        />
        <div
          style={{
            ...skeletonStyles.skeleton,
            ...skeletonStyles.title,
          }}
        />
        <div
          style={{
            ...skeletonStyles.skeleton,
            ...skeletonStyles.text,
            width: '80%',
          }}
        />
        <div
          style={{
            ...skeletonStyles.skeleton,
            ...skeletonStyles.text,
            width: '70%',
          }}
        />
      </div>

      <div style={skeletonStyles.body}>
        <div
          style={{
            ...skeletonStyles.skeleton,
            ...skeletonStyles.description,
          }}
        />
      </div>

      <div style={skeletonStyles.footer}>
        <div
          style={{
            ...skeletonStyles.skeleton,
            ...skeletonStyles.footerLine,
          }}
        />
        <div
          style={{
            ...skeletonStyles.skeleton,
            ...skeletonStyles.footerLine,
            width: '85%',
          }}
        />
      </div>
    </div>
  );
};
