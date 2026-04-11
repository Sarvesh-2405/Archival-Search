import React, { useEffect, useRef, useState } from 'react';
import documentsData from './data/documents.json';
import { useSearch } from './hooks/useSearch';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { ResultsGrid } from './components/ResultsGrid';
import { Pagination } from './components/Pagination';
import { SortDropdown } from './components/SortDropdown';
import { TimelineView } from './components/TimelineView';

const appStyles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f0e8',
  },
  mainContainer: {
    flex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    padding: '1.5rem',
  },
  contentWrapper: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  resultsSection: {
    flex: 1,
    minWidth: 0,
  },
  topControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  filterButton: {
    display: 'none',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#c9a84c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  overlay: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
};

const App = () => {
  const [showTimeline, setShowTimeline] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const resultsRef = useRef(null);

  const documents = documentsData.documents;
  const {
    searchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    clearAllFilters,
    setDateRange,
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    isLoading,
    results,
    allResults,
    totalResults,
    paginationInfo,
  } = useSearch(documents);

  // Handle search submission
  const handleSearch = () => {
    setCurrentPage(1);
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearAllFilters();
    setSortBy('relevance');
  };

  // Remove filter chip
  const handleRemoveFilter = (filterObj) => {
    if (filterObj.types) {
      toggleFilter('types', filterObj.types);
    } else if (filterObj.regions) {
      toggleFilter('regions', filterObj.regions);
    } else if (filterObj.languages) {
      toggleFilter('languages', filterObj.languages);
    } else if (filterObj.institutions) {
      toggleFilter('institutions', filterObj.institutions);
    } else if (filterObj.subjects) {
      toggleFilter('subjects', filterObj.subjects);
    } else if (filterObj.dateRange) {
      setDateRange(null, null);
    }
  };

  // Handle sidebar toggle on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when filters change
  useEffect(() => {
    setSidebarOpen(false);
  }, [filters]);

  // Add media query listener for responsive behavior
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleMediaChange = (e) => {
      if (!e.matches) {
        setSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  return (
    <div style={appStyles.app}>
      <Header />

      <main style={appStyles.mainContainer}>
        {/* Search Bar */}
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClear}
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
        />

        {/* Main content area */}
        <div style={appStyles.contentWrapper}>
          {/* Filter Sidebar */}
          <FilterSidebar
            documents={documents}
            filters={filters}
            onToggleFilter={toggleFilter}
            onSetDateRange={setDateRange}
            onClearAllFilters={clearAllFilters}
            isOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
          />

          {/* Results Section */}
          <div style={appStyles.resultsSection} ref={resultsRef}>
            {/* Top Controls */}
            <div style={appStyles.topControls}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  style={{
                    ...appStyles.filterButton,
                    display: window.innerWidth <= 1024 ? 'block' : 'none',
                  }}
                  onClick={toggleSidebar}
                >
                  ☰ Filters
                </button>
                <SortDropdown currentSort={sortBy} onSortChange={setSortBy} />
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: showTimeline ? '#c9a84c' : '#ddd',
                    color: showTimeline ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setShowTimeline(!showTimeline)}
                >
                  {showTimeline ? '📊 Timeline On' : '📊 Timeline Off'}
                </button>
              </div>
            </div>

            {/* Timeline View */}
            {showTimeline && allResults.length > 0 && (
              <TimelineView
                results={allResults}
                onNodeClick={(docId) => {
                  const doc = documents.find((d) => d.id === docId);
                  if (doc) {
                    // Scroll to document if it's on current page
                    const docElement = document.getElementById(`doc-${docId}`);
                    if (docElement) {
                      docElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      docElement.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.3)';
                      setTimeout(() => {
                        docElement.style.boxShadow = 'none';
                      }, 1000);
                    }
                  }
                }}
              />
            )}

            {/* Results Grid */}
            <div id="results-grid">
              <ResultsGrid
                results={results.map((doc) => ({
                  ...doc,
                  id: `${doc.id}`, // Ensure ID is a string for consistency
                }))}
                isLoading={isLoading}
                totalResults={totalResults}
                paginationInfo={paginationInfo}
              />
            </div>

            {/* Pagination */}
            {totalResults > 0 && paginationInfo.totalPages > 1 && (
              <Pagination
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{
            ...appStyles.overlay,
            display: 'block',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
