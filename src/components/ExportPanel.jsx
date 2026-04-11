import React, { useState } from 'react';
import { exportAsCSV, printDocuments, generateShareableURL, copyShareURL, getAllCitations } from '../utils/exportUtils';
import styles from '../styles/Export.module.css';

/**
 * ExportPanel - Export results as CSV, print, citations, or shareable URL
 */
export function ExportPanel({ documents = [], query = '', filters = {}, onClose }) {
  const [citationFormat, setCitationFormat] = useState('chicago');
  const [selectedForCitation, setSelectedForCitation] = useState(documents[0]);
  const [shareURL, setShareURL] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExportCSV = () => {
    exportAsCSV(documents, `archive-export-${Date.now()}.csv`);
  };

  const handlePrint = () => {
    printDocuments(documents);
  };

  const handleGenerateShareLink = () => {
    const url = generateShareableURL(window.location.origin, query, filters);
    setShareURL(url);
  };

  const handleCopyShareLink = () => {
    if (copyShareURL(shareURL)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Export & Share</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {/* Export Options */}
          <div className={styles.section}>
            <h3>Export Results</h3>
            <div className={styles.optionsGrid}>
              <button onClick={handleExportCSV} className={styles.optionBtn}>
                <span className={styles.icon}>📊</span>
                <span className={styles.label}>CSV</span>
                <span className={styles.desc}>Excel spreadsheet format</span>
              </button>

              <button onClick={handlePrint} className={styles.optionBtn}>
                <span className={styles.icon}>🖨️</span>
                <span className={styles.label}>Print</span>
                <span className={styles.desc}>Print preview</span>
              </button>
            </div>
          </div>

          {/* Shareable Link */}
          <div className={styles.section}>
            <h3>Share Search</h3>
            <p className={styles.description}>Generate a link to this search for sharing with colleagues</p>
            {!shareURL ? (
              <button onClick={handleGenerateShareLink} className={styles.generateBtn}>
                Generate Share Link
              </button>
            ) : (
              <div className={styles.shareBox}>
                <input
                  type="text"
                  value={shareURL}
                  readOnly
                  className={styles.shareInput}
                />
                <button
                  onClick={handleCopyShareLink}
                  className={styles.copyBtn}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          {/* Citations */}
          {documents.length > 0 && (
            <div className={styles.section}>
              <h3>Citations</h3>
              <div className={styles.citationForm}>
                <select
                  value={selectedForCitation?.id || ''}
                  onChange={(e) => {
                    // eslint-disable-next-line eqeqeq
                    const doc = documents.find((d) => d.id == e.target.value);
                    setSelectedForCitation(doc);
                  }}
                  className={styles.select}
                >
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title}
                    </option>
                  ))}
                </select>

                <select
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value)}
                  className={styles.select}
                >
                  <option value="chicago">Chicago Style</option>
                  <option value="mla">MLA</option>
                  <option value="apa">APA</option>
                  <option value="harvard">Harvard</option>
                </select>
              </div>

              {selectedForCitation && (
                <div className={styles.citationOutput}>
                  <div className={styles.citationText}>
                    {getAllCitations(selectedForCitation)[citationFormat]}
                  </div>
                  <button
                    onClick={() => {
                      const citation = getAllCitations(selectedForCitation)[citationFormat];
                      navigator.clipboard.writeText(citation);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={styles.copyBtn}
                  >
                    {copied ? '✓ Copied' : 'Copy Citation'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.closeMainBtn}>Close</button>
        </div>
      </div>
    </div>
  );
}
