import React, { useState } from 'react';
import styles from '../styles/Collections.module.css';

/**
 * CollectionsPanel - Manage collections and document notes
 */
export function CollectionsPanel({ collections = [], notes = {}, onCreateCollection, onDeleteCollection, onAddDocument, onRemoveDocument, onSaveNote, onDeleteNote, documents = [] }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName);
      setNewCollectionName('');
      setShowCreateForm(false);
    }
  };

  const handleSelectDocument = (doc) => {
    setSelectedDocument(doc);
    setNoteText(notes[doc.id]?.text || '');
  };

  const handleSaveNote = () => {
    if (selectedDocument) {
      onSaveNote(selectedDocument.id, noteText);
      setNoteText('');
      setSelectedDocument(null);
    }
  };

  return (
    <div className={styles.panel}>
      <h2>My Collections & Notes</h2>

      <div className={styles.container}>
        {/* Collections List */}
        <div className={styles.section}>
          <h3>Collections</h3>
          {showCreateForm ? (
            <div className={styles.createForm}>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name..."
                className={styles.input}
              />
              <button onClick={handleCreateCollection} className={styles.btn}>Create</button>
              <button onClick={() => setShowCreateForm(false)} className={styles.btnSecondary}>Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className={styles.createBtn}
            >
              + New Collection
            </button>
          )}

          <div className={styles.collectionsList}>
            {collections.length === 0 ? (
              <p className={styles.empty}>No collections yet</p>
            ) : (
              collections.map((col) => (
                <div
                  key={col.id}
                  className={`${styles.collectionItem} ${selectedCollection?.id === col.id ? styles.active : ''}`}
                  onClick={() => setSelectedCollection(col)}
                >
                  <div className={styles.collectionName}>{col.name}</div>
                  <div className={styles.collectionCount}>{col.documents.length} items</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCollection(col.id);
                    }}
                    className={styles.deleteBtn}
                    title="Delete collection"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Collection Contents */}
        {selectedCollection && (
          <div className={styles.section}>
            <h3>{selectedCollection.name}</h3>
            <div className={styles.documentsList}>
              {selectedCollection.documents.length === 0 ? (
                <p className={styles.empty}>No documents in this collection</p>
              ) : (
                selectedCollection.documents.map((docId) => {
                  const doc = documents.find((d) => d.id === docId);
                  if (!doc) return null;
                  return (
                    <div key={docId} className={styles.docItem}>
                      <div className={styles.docInfo}>
                        <div className={styles.docTitle}>{doc.title}</div>
                        <div className={styles.docMeta}>{doc.type} • {doc.date}</div>
                        {notes[docId] && <div className={styles.hasNote}>Has note</div>}
                      </div>
                      <button
                        onClick={() => handleSelectDocument(doc)}
                        className={styles.notesBtn}
                        title="Edit note"
                      >
                        Edit Note
                      </button>
                      <button
                        onClick={() => onRemoveDocument(selectedCollection.id, docId)}
                        className={styles.removeBtn}
                        title="Remove from collection"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Notes Editor */}
        {selectedDocument && (
          <div className={styles.section}>
            <h3>Notes: {selectedDocument.title}</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add or edit notes..."
              className={styles.notesEditor}
            />
            <div className={styles.notesButtons}>
              <button onClick={handleSaveNote} className={styles.btn}>Save Note</button>
              {notes[selectedDocument.id] && (
                <button
                  onClick={() => {
                    onDeleteNote(selectedDocument.id);
                    setSelectedDocument(null);
                  }}
                  className={styles.btnDanger}
                >
                  Delete Note
                </button>
              )}
              <button onClick={() => setSelectedDocument(null)} className={styles.btnSecondary}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
