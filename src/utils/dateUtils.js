// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) {
    return 'Unknown';
  }

  try {
    // Handle negative years (BC dates)
    const year = parseInt(dateString.substring(0, 5), 10);

    if (year < 0) {
      const bcYear = Math.abs(year);
      return `${bcYear} BC`;
    }

    // Extract just the year for display
    const displayYear = dateString.substring(0, 4);
    return displayYear;
  } catch (e) {
    return 'Unknown';
  }
};

// Extract year from date string
export const getYear = (dateString) => {
  if (!dateString) {
    return null;
  }

  try {
    return parseInt(dateString.substring(0, 5), 10);
  } catch (e) {
    return null;
  }
};

// Get century string from year
export const getCentury = (year) => {
  if (year === null || year === undefined) {
    return 'Unknown';
  }

  if (year < 0) {
    const bcYear = Math.abs(year);
    const century = Math.ceil(bcYear / 100);
    return `${century} BC`;
  }

  const century = Math.ceil(year / 100);
  return `${century}${getSuffix(century)} century`;
};

// Get ordinal suffix (st, nd, rd, th)
const getSuffix = (num) => {
  if (num % 10 === 1 && num % 100 !== 11) return 'st';
  if (num % 10 === 2 && num % 100 !== 12) return 'nd';
  if (num % 10 === 3 && num % 100 !== 13) return 'rd';
  return 'th';
};

// Group documents by century
export const groupByCentury = (documents) => {
  const groups = {};

  documents.forEach((doc) => {
    const year = getYear(doc.date);
    const century = getCentury(year);

    if (!groups[century]) {
      groups[century] = [];
    }
    groups[century].push(doc);
  });

  // Sort groups chronologically
  const sorted = {};
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    // Extract numbers for proper sorting
    const aNum = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const bNum = parseInt(b.match(/\d+/)?.[0] || '0', 10);

    // BC comes first
    if (a.includes('BC') && !b.includes('BC')) return -1;
    if (!a.includes('BC') && b.includes('BC')) return 1;

    // Both BC or both AD
    if (a.includes('BC') && b.includes('BC')) {
      return bNum - aNum; // Reverse order for BC
    }

    return aNum - bNum;
  });

  sortedKeys.forEach((key) => {
    sorted[key] = groups[key];
  });

  return sorted;
};

// Parse date range from form input
export const parseYearRange = (fromYear, toYear) => {
  let from = fromYear !== null && fromYear !== undefined ? parseInt(fromYear, 10) : null;
  let to = toYear !== null && toYear !== undefined ? parseInt(toYear, 10) : null;

  if (isNaN(from)) from = null;
  if (isNaN(to)) to = null;

  return { from, to };
};
