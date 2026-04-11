// Normalize text for diacritic-tolerant matching
const normalizeDiacritics = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Score a single field against search terms
const scoreField = (fieldValue, searchTerms, fieldWeight) => {
  if (!fieldValue) return 0;

  // Convert field value to string if it's not already
  const fieldStr = Array.isArray(fieldValue)
    ? fieldValue.join(' ')
    : String(fieldValue);

  const normalized = normalizeDiacritics(fieldStr);
  const words = normalized.split(/\s+/);
  let score = 0;

  // Score each search term in this field
  searchTerms.forEach((term) => {
    const normalizedTerm = normalizeDiacritics(term);
    
    // Check for exact word match (highest priority)
    if (words.includes(normalizedTerm)) {
      score += fieldWeight * 1.5; // Exact word match
    }
    // Check for word prefix match
    else if (words.some(word => word.startsWith(normalizedTerm))) {
      score += fieldWeight * 1.2; // Word prefix match
    }
    // Check for substring match 
    else if (normalized.includes(normalizedTerm)) {
      score += fieldWeight; // Substring match
    }
  });

  return score;
};

export const searchDocuments = (documents, query, filters = {}) => {
  const hasQuery = query && query.trim();
  const hasFilters = Object.keys(filters).some(key => {
    const value = filters[key];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return value !== null && value !== undefined;
  });

  // If no query and no filters, return all documents
  if (!hasQuery && !hasFilters) {
    return documents.map((doc) => ({ ...doc, score: 0 }));
  }

  const searchTerms = hasQuery
    ? query.trim().split(/\s+/).filter((term) => term.length > 0)
    : [];

  // Field weights for relevance scoring
  const fieldWeights = {
    title: 10,
    subjects: 7,
    tags: 7,
    keywords: 5,
    description: 3,
    author: 3,
    place: 2,
    region: 2,
  };

  let results = documents.map((doc) => {
    let score = 0;

    // Score across all searchable fields only if there's a query
    if (hasQuery) {
      Object.entries(fieldWeights).forEach(([field, weight]) => {
        score += scoreField(doc[field], searchTerms, weight);
      });
    }

    return {
      ...doc,
      score,
      highlightPositions: hasQuery ? findHighlights(doc, searchTerms) : {},
    };
  });

  // Filter by score (only apply if there's a query)
  if (hasQuery) {
    results = results.filter((doc) => doc.score > 0);
  }

  // Apply additional filters
  if (filters.types && filters.types.length > 0) {
    results = results.filter((doc) =>
      filters.types.includes(doc.type)
    );
  }

  if (filters.regions && filters.regions.length > 0) {
    results = results.filter((doc) =>
      filters.regions.includes(doc.region)
    );
  }

  if (filters.languages && filters.languages.length > 0) {
    results = results.filter((doc) =>
      filters.languages.includes(doc.language)
    );
  }

  if (filters.institutions && filters.institutions.length > 0) {
    results = results.filter((doc) =>
      filters.institutions.includes(doc.holdingInstitution)
    );
  }

  if (filters.subjects && filters.subjects.length > 0) {
    results = results.filter((doc) => {
      const docSubjects = Array.isArray(doc.subjects) ? doc.subjects : [];
      return filters.subjects.some((subject) =>
        docSubjects.includes(subject)
      );
    });
  }

  // Date range filter
  if (filters.dateFrom !== null || filters.dateTo !== null) {
    results = results.filter((doc) => {
      if (!doc.date) return false;

      const year = parseInt(doc.date.substring(0, 5), 10);
      if (filters.dateFrom !== null && year < filters.dateFrom) return false;
      if (filters.dateTo !== null && year > filters.dateTo) return false;
      return true;
    });
  }

  // Sort by score descending (default)
  results.sort((a, b) => b.score - a.score);

  return results;
};

// Find highlight positions in text
export const findHighlights = (doc, searchTerms) => {
  const highlights = {};

  if (!searchTerms || searchTerms.length === 0) {
    return highlights;
  }

  const fieldsToHighlight = ['title', 'description'];

  fieldsToHighlight.forEach((field) => {
    if (!doc[field]) return;

    const text = String(doc[field]);
    const normalized = normalizeDiacritics(text);
    highlights[field] = [];

    searchTerms.forEach((term) => {
      const normalizedTerm = normalizeDiacritics(term);
      let startIdx = 0;

      while ((startIdx = normalized.indexOf(normalizedTerm, startIdx)) !== -1) {
        highlights[field].push({
          start: startIdx,
          end: startIdx + normalizedTerm.length,
        });
        startIdx += normalizedTerm.length;
      }
    });
  });

  return highlights;
};

// Highlight text with <mark> tags
export const highlightText = (text, highlights) => {
  if (!text || !highlights || highlights.length === 0) {
    return text;
  }

  // Merge overlapping highlights
  const merged = [];
  const sorted = [...highlights].sort((a, b) => a.start - b.start);

  sorted.forEach((h) => {
    if (merged.length > 0) {
      const last = merged[merged.length - 1];
      if (h.start <= last.end) {
        last.end = Math.max(last.end, h.end);
      } else {
        merged.push(h);
      }
    } else {
      merged.push(h);
    }
  });

  // Build string with marks
  let result = '';
  let lastIdx = 0;

  merged.forEach((h) => {
    result += text.substring(lastIdx, h.start);
    result += `<mark>${text.substring(h.start, h.end)}</mark>`;
    lastIdx = h.end;
  });

  result += text.substring(lastIdx);
  return result;
};
