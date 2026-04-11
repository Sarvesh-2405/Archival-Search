import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useInfiniteScroll - Implements infinite scroll pagination using IntersectionObserver
 */
export function useInfiniteScroll(items, itemsPerPage = 20) {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  // Update displayed items when page or items change
  useEffect(() => {
    const endIndex = page * itemsPerPage;
    setDisplayedItems(items.slice(0, endIndex));
    setHasMore(endIndex < items.length);
  }, [page, items, itemsPerPage]);

  // Set up IntersectionObserver for lazy loading
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        setPage((p) => p + 1);
      }
    }, { threshold: 0.1 });

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const resetScroll = useCallback(() => {
    setPage(1);
  }, []);

  return { displayedItems, hasMore, observerTarget, resetScroll };
}
