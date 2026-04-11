/**
 * citationUtils - Citation generation in multiple formats
 */

/**
 * Chicago Manual of Style citation format
 */
export function chicagoStyle(doc) {
  const author = doc.author ? `${doc.author}. ` : '';
  const title = `"${doc.title}."`;
  const place = doc.place ? ` ${doc.place}:` : ':';
  const institution = doc.holdingInstitution ? ` ${doc.holdingInstitution},` : '';
  const date = doc.date ? ` ${doc.date}` : '';
  
  return `${author}${title}${place}${institution}${date}.`;
}

/**
 * MLA format citation
 */
export function mlaStyle(doc) {
  const author = doc.author ? `${doc.author}. ` : '';
  const title = `"${doc.title}."`;
  const institution = doc.holdingInstitution ? ` ${doc.holdingInstitution},` : '';
  const place = doc.place ? ` ${doc.place},` : ',';
  const date = doc.date ? ` ${doc.date}` : '';
  
  return `${author}${title}${place}${institution}${date}.`;
}

/**
 * APA format citation
 */
export function apaStyle(doc) {
  const author = doc.author ? `${doc.author}. ` : '';
  const date = doc.date ? `(${doc.date}). ` : '(n.d.). ';
  const title = `${doc.title}.`;
  const institution = doc.holdingInstitution ? ` ${doc.holdingInstitution},` : '';
  const place = doc.place ? ` ${doc.place}` : '';
  
  return `${author}${date}${title}${institution}${place}.`;
}

/**
 * Harvard format citation
 */
export function harvardStyle(doc) {
  const author = doc.author ? `${doc.author} ` : '';
  const date = doc.date ? `${doc.date}. ` : 'n.d. ';
  const title = `${doc.title}.`;
  const institution = doc.holdingInstitution ? ` ${doc.holdingInstitution}.` : '';
  
  return `${author}${date}${title}${institution}`;
}

/**
 * Get all citation formats for a document
 */
export function getAllCitations(doc) {
  return {
    chicago: chicagoStyle(doc),
    mla: mlaStyle(doc),
    apa: apaStyle(doc),
    harvard: harvardStyle(doc)
  };
}
