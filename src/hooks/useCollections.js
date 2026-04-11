import { useState, useEffect } from 'react';

const COLLECTIONS_KEY = 'archval_collections';
const NOTES_KEY = 'archval_notes';

/**
 * useCollections - Manages user collections and document notes
 */
export function useCollections() {
  const [collections, setCollections] = useState([]);
  const [notes, setNotes] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(COLLECTIONS_KEY);
    const storedNotes = localStorage.getItem(NOTES_KEY);
    if (stored) setCollections(JSON.parse(stored));
    if (storedNotes) setNotes(JSON.parse(storedNotes));
  }, []);

  const createCollection = (name) => {
    const newCollection = {
      id: Date.now(),
      name,
      documents: [],
      createdAt: Date.now()
    };
    const updated = [...collections, newCollection];
    setCollections(updated);
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
    return newCollection;
  };

  const deleteCollection = (collectionId) => {
    const updated = collections.filter((c) => c.id !== collectionId);
    setCollections(updated);
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
  };

  const addDocumentToCollection = (collectionId, documentId) => {
    const updated = collections.map((c) => {
      if (c.id === collectionId && !c.documents.includes(documentId)) {
        return { ...c, documents: [...c.documents, documentId] };
      }
      return c;
    });
    setCollections(updated);
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
  };

  const removeDocumentFromCollection = (collectionId, documentId) => {
    const updated = collections.map((c) => {
      if (c.id === collectionId) {
        return { ...c, documents: c.documents.filter((d) => d !== documentId) };
      }
      return c;
    });
    setCollections(updated);
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
  };

  const saveNote = (documentId, noteText) => {
    const updated = { ...notes, [documentId]: { text: noteText, updatedAt: Date.now() } };
    setNotes(updated);
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  };

  const deleteNote = (documentId) => {
    const { [documentId]: _, ...updated } = notes;
    setNotes(updated);
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  };

  const getNote = (documentId) => notes[documentId];

  return {
    collections,
    createCollection,
    deleteCollection,
    addDocumentToCollection,
    removeDocumentFromCollection,
    notes,
    saveNote,
    deleteNote,
    getNote
  };
}
