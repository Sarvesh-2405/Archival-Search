import React, { useMemo, useState } from 'react';
import { FilterGroup } from './FilterGroup';
import {
  extractUniqueValues,
  getFilterCount,
  getAllSubjects,
  getSubjectCount,
} from '../utils/filterEngine';
import styles from '../styles/FilterSidebar.module.css';

export const FilterSidebar = ({
  documents,
  filters,
  onToggleFilter,
  onSetDateRange,
  onClearAllFilters,
  isOpen,
  onToggleSidebar,
}) => {
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
  const [dateTo, setDateTo] = useState(filters.dateTo || '');

  // Get dynamic filter options with counts
  const types = useMemo(() => {
    const uniqueTypes = extractUniqueValues(documents, 'type');
    return uniqueTypes.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      count: getFilterCount(documents, 'type', type, filters),
    }));
  }, [documents, filters]);

  const regions = useMemo(() => {
    const uniqueRegions = extractUniqueValues(documents, 'region');
    return uniqueRegions.map((region) => ({
      value: region,
      label: region,
      count: getFilterCount(documents, 'region', region, filters),
    }));
  }, [documents, filters]);

  const languages = useMemo(() => {
    const uniqueLangs = extractUniqueValues(documents, 'language');
    return uniqueLangs.map((lang) => ({
      value: lang,
      label: lang,
      count: getFilterCount(documents, 'language', lang, filters),
    }));
  }, [documents, filters]);

  const institutions = useMemo(() => {
    const uniqueInsts = extractUniqueValues(documents, 'holdingInstitution');
    return uniqueInsts.map((inst) => ({
      value: inst,
      label: inst,
      count: getFilterCount(documents, 'holdingInstitution', inst, filters),
    }));
  }, [documents, filters]);

  const subjects = useMemo(() => {
    const allSubjects = getAllSubjects(documents);
    return allSubjects.map((subject) => ({
      value: subject,
      label: subject.charAt(0).toUpperCase() + subject.slice(1),
      count: getSubjectCount(documents, subject, filters),
    }));
  }, [documents, filters]);

  const handleDateChange = () => {
    const from = dateFrom ? parseInt(dateFrom, 10) : null;
    const to = dateTo ? parseInt(dateTo, 10) : null;
    onSetDateRange(from, to);
  };

  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onToggleSidebar}
        />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Filters</h2>
          <button className={styles.clearAll} onClick={onClearAllFilters}>
            Clear All
          </button>
        </div>

        <div className={styles.sidebarContent}>
          {/* Document Type Filter */}
          <FilterGroup
            title="Document Type"
            options={types}
            selectedValues={filters.types || []}
            onChange={(value) => onToggleFilter('types', value)}
          />

          {/* Date Range Filter */}
          <div className={styles.filterGroup}>
            <h3>Date Range</h3>
            <div className={styles.dateRange}>
              <div className={styles.dateInputs}>
                <input
                  type="number"
                  placeholder="From Year"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  onBlur={handleDateChange}
                  className={styles.dateInput}
                />
                <span style={{ color: 'var(--text-lighter)' }}>–</span>
                <input
                  type="number"
                  placeholder="To Year"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  onBlur={handleDateChange}
                  className={styles.dateInput}
                />
              </div>
              <small style={{ color: 'var(--text-lighter)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                Supports negative years (BC)
              </small>
            </div>
          </div>

          {/* Region Filter */}
          <FilterGroup
            title="Region"
            options={regions}
            selectedValues={filters.regions || []}
            onChange={(value) => onToggleFilter('regions', value)}
          />

          {/* Language Filter */}
          <FilterGroup
            title="Language"
            options={languages}
            selectedValues={filters.languages || []}
            onChange={(value) => onToggleFilter('languages', value)}
          />

          {/* Institution Filter */}
          <FilterGroup
            title="Holding Institution"
            options={institutions}
            selectedValues={filters.institutions || []}
            onChange={(value) => onToggleFilter('institutions', value)}
          />

          {/* Subject Filter */}
          <FilterGroup
            title="Subjects"
            options={subjects}
            selectedValues={filters.subjects || []}
            onChange={(value) => onToggleFilter('subjects', value)}
          />
        </div>
      </aside>
    </>
  );
};
