import { useMemo, useState, useCallback } from 'react';
import { searchDocuments } from '../utils/searchEngine';
import { useDebounce } from './useDebounce';

export const useSearch = (documents) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [],
    regions: [],
    languages: [],
    institutions: [],
    subjects: [],
    dateFrom: null,
    dateTo: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Simulate loading state for better UX
  const simulateSearch = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 150));
    setIsLoading(false);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, []);

  // Toggle a specific filter value
  const toggleFilter = useCallback((filterType, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
    setCurrentPage(1); // Reset to page 1
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      types: [],
      regions: [],
      languages: [],
      institutions: [],
      subjects: [],
      dateFrom: null,
      dateTo: null,
    });
    setCurrentPage(1);
  }, []);

  // Set date range
  const setDateRange = useCallback((from, to) => {
    setFilters((prev) => ({
      ...prev,
      dateFrom: from,
      dateTo: to,
    }));
    setCurrentPage(1);
  }, []);

  // Perform search and get results
  const searchResults = useMemo(() => {
    void simulateSearch();
    return searchDocuments(documents, debouncedQuery, filters);
  }, [documents, debouncedQuery, filters, simulateSearch]);

  // Sort results
  const sortedResults = useMemo(() => {
    const results = [...searchResults];

    switch (sortBy) {
      case 'relevance':
        return results.sort((a, b) => b.score - a.score);
      case 'date-newest':
        return results.sort((a, b) => {
          const yearA = a.date ? parseInt(a.date.substring(0, 5), 10) : -Infinity;
          const yearB = b.date ? parseInt(b.date.substring(0, 5), 10) : -Infinity;
          return yearB - yearA;
        });
      case 'date-oldest':
        return results.sort((a, b) => {
          const yearA = a.date ? parseInt(a.date.substring(0, 5), 10) : Infinity;
          const yearB = b.date ? parseInt(b.date.substring(0, 5), 10) : Infinity;
          return yearA - yearB;
        });
      case 'title-asc':
        return results.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return results.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return results;
    }
  }, [searchResults, sortBy]);

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(sortedResults.length / ITEMS_PER_PAGE);
  const validPage = Math.min(currentPage, Math.max(1, totalPages));

  const paginatedResults = useMemo(() => {
    const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
    return sortedResults.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedResults, validPage]);

  // Get pagination info
  const paginationInfo = useMemo(() => {
    const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, sortedResults.length);

    return {
      startIndex: endIdx > 0 ? startIdx + 1 : 0,
      endIndex: endIdx,
      total: sortedResults.length,
      currentPage: validPage,
      totalPages: Math.max(1, totalPages),
    };
  }, [validPage, sortedResults.length, totalPages]);

  return {
    // Input state
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    toggleFilter,
    clearAllFilters,
    setDateRange,
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    isLoading,

    // Results
    results: paginatedResults,
    allResults: sortedResults,
    totalResults: sortedResults.length,
    paginationInfo,
  };
};
