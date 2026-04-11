/**
 * exportUtils - Export and sharing utilities for documents and search results
 */

/**
 * Export results as CSV
 */
export function exportAsCSV(documents, filename = 'archive-results.csv') {
  const headers = ['ID', 'Title', 'Type', 'Date', 'Place', 'Region', 'Language', 'Author', 'Institution', 'Collection'];
  
  const rows = documents.map((doc) => [
    doc.id,
    `"${(doc.title || '').replace(/"/g, '""')}"`,
    doc.type,
    doc.date,
    doc.place,
    doc.region,
    doc.language,
    doc.author,
    doc.holdingInstitution,
    doc.collection
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', filename);
  link.click();
}

/**
 * Export as print view
 */
export function printDocuments(documents) {
  const printWindow = window.open('', '', 'height=600,width=800');
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Imperial Archive - Print Export</title>
        <style>
          body { font-family: 'Libre Baskerville', serif; line-height: 1.6; margin: 20px; color: #0f1623; }
          .document { page-break-inside: avoid; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #8b7355; }
          .title { font-family: 'Cinzel', serif; font-size: 18px; font-weight: bold; margin: 10px 0; }
          .metadata { font-size: 12px; color: #555; margin: 8px 0; }
          .description { margin: 10px 0; font-style: italic; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1 style="font-family: 'Cinzel', serif; text-align: center; border-bottom: 3px solid #8b7355; padding-bottom: 15px;">
          Imperial Archive Export
        </h1>
        ${documents.map((doc) => `
          <div class="document">
            <div class="title">${doc.title}</div>
            <div class="metadata">
              <strong>Type:</strong> ${doc.type} | 
              <strong>Date:</strong> ${doc.date} | 
              <strong>Place:</strong> ${doc.place}
            </div>
            <div class="metadata">
              <strong>Region:</strong> ${doc.region} | 
              <strong>Language:</strong> ${doc.language} | 
              <strong>Author:</strong> ${doc.author}
            </div>
            <div class="metadata">
              <strong>Institution:</strong> ${doc.holdingInstitution}
            </div>
            <div class="description">${doc.description}</div>
          </div>
        `).join('')}
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.print();
}

/**
 * Generate shareable URL with encoded search state
 */
export function generateShareableURL(baseURL, query, filters) {
  const params = new URLSearchParams({
    q: query,
    types: filters.types?.join(',') || '',
    regions: filters.regions?.join(',') || '',
    languages: filters.languages?.join(',') || '',
    institutions: filters.institutions?.join(',') || ''
  });
  return `${baseURL}?${params.toString()}`;
}

/**
 * Copy shareable URL to clipboard
 */
export function copyShareURL(url) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    return true;
  } else {
    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    const success = document.execCommand('copy');
    document.body.removeChild(el);
    return success;
  }
}

/**
 * Generate Chicago style citation for a document
 */
export function generateChicagoCitation(doc) {
  const author = doc.author ? `${doc.author}. ` : '';
  const title = `"${doc.title}."`;
  const date = doc.date ? ` ${doc.date}.` : '';
  const institution = doc.holdingInstitution ? ` ${doc.holdingInstitution}.` : '';
  
  return `${author}${title}${date}${institution}`;
}

/**
 * Generate MLA style citation for a document
 */
export function generateMLACitation(doc) {
  const author = doc.author ? `${doc.author}. ` : '';
  const title = `"${doc.title}."`;
  const date = doc.date ? ` Created ${doc.date}.` : '';
  const institution = doc.holdingInstitution ? ` ${doc.holdingInstitution}.` : '';
  
  return `${author}${title}${date}${institution}`;
}

/**
 * Generate APA style citation for a document
 */
export function generateAPACitation(doc) {
  const author = doc.author ? `${doc.author}. ` : '';
  const date = doc.date ? ` (${doc.date}).` : ' (n.d.).';
  const title = `${doc.title}.`;
  const institution = doc.holdingInstitution ? ` ${doc.holdingInstitution}.` : '';
  
  return `${author}${date} ${title}${institution}`;
}

/**
 * Generate Harvard style citation for a document
 */
export function generateHarvardCitation(doc) {
  const author = doc.author ? `${doc.author} ` : '';
  const date = doc.date ? `(${doc.date}) ` : '(n.d.) ';
  const title = `'${doc.title}'. `;
  const institution = doc.holdingInstitution ? doc.holdingInstitution : '';
  
  return `${author}${date}${title}${institution}`;
}

/**
 * Get all citation formats for a document
 */
export function getAllCitations(doc) {
  return {
    chicago: generateChicagoCitation(doc),
    mla: generateMLACitation(doc),
    apa: generateAPACitation(doc),
    harvard: generateHarvardCitation(doc)
  };
}
