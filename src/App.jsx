import React, { useEffect, useRef, useState } from 'react';
import documentsData from './data/documents.json';
import { useSearch } from './hooks/useSearch';
import { useVoiceSearch } from './hooks/useVoiceSearch';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useCollections } from './hooks/useCollections';
import { useViewMode } from './hooks/useViewMode';
import { useMediaQuery } from './hooks/useMediaQuery';
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
import { CollectionsPanel } from './components/CollectionsPanel';
import { ExportPanel } from './components/ExportPanel';
import { ViewModeToggle } from './components/ViewModeToggle';
import { AccessibilityBar } from './components/AccessibilityBar';
import { MapView } from './components/MapView';
import styles from './styles/App.module.css';

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
  const [showCollectionsPanel, setShowCollectionsPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Reactive breakpoint — replaces the broken window.innerWidth snapshot
  const isTabletOrSmaller = useMediaQuery('(max-width: 1024px)');

  // Define documents first before any hooks that depend on it
  const documents = documentsData.documents;

  const { history, addToHistory, clearHistory, savedSearches, saveSearch, removeSavedSearch } = useSearchHistory();
  const { collections, createCollection, deleteCollection, addDocumentToCollection, removeDocumentFromCollection, notes, saveNote, deleteNote } = useCollections();
  const { viewMode, switchMode } = useViewMode();
  const { isListening, isSupported: voiceSupported, transcript, startListening, stopListening } = useVoiceSearch((text) => {
    setSearchQuery(text);
  });

  const {
    searchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    clearAllFilters,
    setDateRange,
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
  };

  // Handle advanced search
  const handleAdvancedSearch = (query) => {
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

  // Close sidebar when switching to desktop layout
  useEffect(() => {
    if (!isTabletOrSmaller) {
      setSidebarOpen(false);
    }
  }, [isTabletOrSmaller]);

  return (
    <div className={styles.app}>
      <Header />
      <AccessibilityBar />

      <main className={styles.mainContainer} id="main">
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
        <div className={styles.contentWrapper}>
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
          <div className={styles.resultsSection} ref={resultsRef}>
            {/* Top Controls */}
            <div className={styles.topControls}>
              <div className={styles.topControlsLeft}>
                {/* Filters button: shown only on tablet/mobile via CSS module media query */}
                {isTabletOrSmaller && (
                  <button
                    className={styles.filterButton}
                    onClick={toggleSidebar}
                  >
                    Filters
                  </button>
                )}
                <SortDropdown currentSort={sortBy} onSortChange={setSortBy} />
                <ViewModeToggle currentMode={viewMode} onModeChange={switchMode} />

                <div className={styles.divider} />

                <button
                  className={showTimeline ? styles.actionBtnActive : styles.actionBtn}
                  onClick={() => setShowTimeline(!showTimeline)}
                >
                  Timeline
                </button>
                <button
                  className={showMap ? styles.actionBtnActive : styles.actionBtn}
                  onClick={() => setShowMap(!showMap)}
                >
                  Map
                </button>
                <button
                  className={showCollectionsPanel ? styles.actionBtnActive : styles.actionBtn}
                  onClick={() => setShowCollectionsPanel(!showCollectionsPanel)}
                >
                  Collections
                </button>
                <button
                  className={styles.exportButton}
                  onClick={() => setShowExportPanel(true)}
                >
                  Export
                </button>
              </div>
            </div>

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

            {/* Map View */}
            {showMap && (
              <MapView
                results={allResults}
                onMarkerClick={handleViewDetails}
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
          className={styles.overlay}
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
