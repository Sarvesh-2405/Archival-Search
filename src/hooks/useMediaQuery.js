import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks whether a CSS media query matches.
 * Responds reactively to viewport changes (unlike window.innerWidth snapshots).
 *
 * @param {string} query - A valid CSS media query string, e.g. '(max-width: 1024px)'
 * @returns {boolean} - true if the media query currently matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 1024px)');
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);

    // Set initial value in case it changed between render and effect
    setMatches(mediaQueryList.matches);

    // Use modern addEventListener (addListener is deprecated)
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};
