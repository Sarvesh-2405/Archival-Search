// Extract unique values for dynamic filter options
export const extractUniqueValues = (documents, field) => {
  const values = new Set();

  documents.forEach((doc) => {
    const value = doc[field];
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) values.add(v);
      });
    } else if (value) {
      values.add(value);
    }
  });

  return Array.from(values).sort();
};

// Get count of documents that match a specific filter value
export const getFilterCount = (documents, field, value, filters = {}) => {
  return documents.filter((doc) => {
    // Check if document matches current filters
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(doc.type)) return false;
    }

    if (filters.regions && filters.regions.length > 0) {
      if (!filters.regions.includes(doc.region)) return false;
    }

    if (filters.languages && filters.languages.length > 0) {
      if (!filters.languages.includes(doc.language)) return false;
    }

    if (filters.institutions && filters.institutions.length > 0) {
      if (!filters.institutions.includes(doc.holdingInstitution)) return false;
    }

    if (filters.subjects && filters.subjects.length > 0) {
      const docSubjects = Array.isArray(doc.subjects) ? doc.subjects : [];
      if (!filters.subjects.some((subject) => docSubjects.includes(subject))) {
        return false;
      }
    }

    if (filters.dateFrom !== null || filters.dateTo !== null) {
      if (!doc.date) return false;
      const year = parseInt(doc.date.substring(0, 5), 10);
      if (filters.dateFrom !== null && year < filters.dateFrom) return false;
      if (filters.dateTo !== null && year > filters.dateTo) return false;
    }

    // Check if this document matches the field value
    const fieldValue = doc[field];
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(value);
    }
    return fieldValue === value;
  }).length;
};

// Get all subjects across documents
export const getAllSubjects = (documents) => {
  const subjects = new Set();
  documents.forEach((doc) => {
    if (Array.isArray(doc.subjects)) {
      doc.subjects.forEach((subject) => {
        if (subject) subjects.add(subject);
      });
    }
  });
  return Array.from(subjects).sort();
};

// Count subjects in filtered documents
export const getSubjectCount = (documents, subject, filters = {}) => {
  return documents.filter((doc) => {
    // Apply other filters first
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(doc.type)) return false;
    }

    if (filters.regions && filters.regions.length > 0) {
      if (!filters.regions.includes(doc.region)) return false;
    }

    if (filters.languages && filters.languages.length > 0) {
      if (!filters.languages.includes(doc.language)) return false;
    }

    if (filters.institutions && filters.institutions.length > 0) {
      if (!filters.institutions.includes(doc.holdingInstitution)) return false;
    }

    if (filters.dateFrom !== null || filters.dateTo !== null) {
      if (!doc.date) return false;
      const year = parseInt(doc.date.substring(0, 5), 10);
      if (filters.dateFrom !== null && year < filters.dateFrom) return false;
      if (filters.dateTo !== null && year > filters.dateTo) return false;
    }

    // Check subject match
    const docSubjects = Array.isArray(doc.subjects) ? doc.subjects : [];
    return docSubjects.includes(subject);
  }).length;
};
