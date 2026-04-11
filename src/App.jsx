import React, { useEffect, useRef, useState } from 'react';
import documentsData from './data/documents.json';
import { useSearch } from './hooks/useSearch';
import { useVoiceSearch } from './hooks/useVoiceSearch';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useCollections } from './hooks/useCollections';
import { useViewMode } from './hooks/useViewMode';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { searchCache } from './utils/searchCache';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { ResultsGrid } from './components/ResultsGrid';
import { Pagination } from './components/Pagination';
import { SortDropdown } from './components/SortDropdown';
import { TimelineView } from './components/TimelineView';
import { DetailModal } from './components/DetailModal';
import { AdvancedSearch } from './components/AdvancedSearch';
import { SearchHistory } from './components/SearchHistory';
import { StatsDashboard } from './components/StatsDashboard';
import { CollectionsPanel } from './components/CollectionsPanel';
import { ExportPanel } from './components/ExportPanel';
import { ViewModeToggle } from './components/ViewModeToggle';
import { AccessibilityBar } from './components/AccessibilityBar';

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
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('archival-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const resultsRef = useRef(null);

  // New Feature State Management
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showStatsDashboard, setShowStatsDashboard] = useState(false);
  const [showCollectionsPanel, setShowCollectionsPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [advancedModes, setAdvancedModes] = useState({});
  const [advancedFieldSearch, setAdvancedFieldSearch] = useState('any');

  // Define documents first before any hooks that depend on it
  const documents = documentsData.documents;

  const { history, addToHistory, clearHistory, savedSearches, saveSearch, removeSavedSearch } = useSearchHistory();
  const { collections, createCollection, deleteCollection, addDocumentToCollection, removeDocumentFromCollection, notes, saveNote, deleteNote, getNote } = useCollections();
  const { viewMode, switchMode } = useViewMode();
  const { isListening, isSupported: voiceSupported, transcript, startListening, stopListening } = useVoiceSearch((text) => {
    setSearchQuery(text);
  });
  const { displayedItems: infiniteResults, hasMore, observerTarget } = useInfiniteScroll(documents, 20);

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
    // Add to search history
    addToHistory(searchQuery);
    // Clear search cache to get fresh results with new search
    searchCache.clearQuery(searchQuery);
    setCurrentPage(1);
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearAllFilters();
    setSortBy('relevance');
    setAdvancedModes({});
  };

  // Handle advanced search
  const handleAdvancedSearch = (query, modes, fieldSearch) => {
    setAdvancedModes(modes);
    setAdvancedFieldSearch(fieldSearch);
    setSearchQuery(query);
    setShowAdvancedSearch(false);
    handleSearch();
  };

  // Handle viewing document details
  const handleViewDetails = (document) => {
    setSelectedDocument(document);
  };

  // Handle closing detail modal
  const handleCloseModal = () => {
    setSelectedDocument(null);
  };

  // Handle toggling favorite
  const handleToggleFavorite = (docId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(docId)
        ? prevFavorites.filter((id) => id !== docId)
        : [...prevFavorites, docId];
      // Save to localStorage
      localStorage.setItem('archival-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Check if document is favorite
  const isFavorite = (docId) => favorites.includes(docId);

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
      <AccessibilityBar />

      <main style={appStyles.mainContainer} id="main">
        {/* Search Bar */}
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClear}
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          isListening={isListening}
          isSupported={voiceSupported}
          transcript={transcript}
          startListening={startListening}
          stopListening={stopListening}
          onToggleAdvancedSearch={() => setShowAdvancedSearch(true)}
          history={history}
          savedSearches={savedSearches}
          onSelectQuery={(query) => {
            setSearchQuery(query);
            handleSearch();
          }}
          onClearHistory={clearHistory}
          onSaveSearch={saveSearch}
          onRemoveSaved={removeSavedSearch}
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
                <ViewModeToggle currentMode={viewMode} onModeChange={switchMode} />
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
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: showStatsDashboard ? '#c9a84c' : '#ddd',
                    color: showStatsDashboard ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setShowStatsDashboard(!showStatsDashboard)}
                >
                  {showStatsDashboard ? '📈 Stats On' : '📈 Stats Off'}
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: showCollectionsPanel ? '#c9a84c' : '#ddd',
                    color: showCollectionsPanel ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setShowCollectionsPanel(!showCollectionsPanel)}
                >
                  {showCollectionsPanel ? '📚 Collections On' : '📚 Collections Off'}
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#8b7355',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setShowExportPanel(true)}
                >
                  📤 Export
                </button>
              </div>
            </div>

            {/* Stats Dashboard */}
            {showStatsDashboard && (
              <StatsDashboard documents={allResults} />
            )}

            {/* Collections Panel */}
            {showCollectionsPanel && (
              <CollectionsPanel
                collections={collections}
                notes={notes}
                onCreateCollection={createCollection}
                onDeleteCollection={deleteCollection}
                onAddDocument={addDocumentToCollection}
                onRemoveDocument={removeDocumentFromCollection}
                onSaveNote={saveNote}
                onDeleteNote={deleteNote}
                documents={documents}
              />
            )}

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
                onViewDetails={handleViewDetails}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                viewMode={viewMode}
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

      {/* Detail Modal */}
      {selectedDocument && (
        <DetailModal
          document={selectedDocument}
          onClose={handleCloseModal}
          isFavorite={isFavorite(selectedDocument.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <AdvancedSearch
          onSearch={handleAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
        />
      )}

      {/* Export Panel Modal */}
      {showExportPanel && (
        <ExportPanel
          documents={allResults}
          query={searchQuery}
          filters={filters}
          onClose={() => setShowExportPanel(false)}
        />
      )}
    </div>
  );
};

export default App;
