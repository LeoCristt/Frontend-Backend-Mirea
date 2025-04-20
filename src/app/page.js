'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    setIsOnline(navigator.onLine);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.log('Service Worker registration failed', err));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote }]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Заметки</title>
        <meta name="description" content="PWA для управления заметками" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Заметки 📝</h1>
        {!isOnline && <p className={styles.offline}>📴 Офлайн-режим</p>}

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Введите заметку"
            className={styles.input}
          />
          <button onClick={addNote} className={styles.button}>➕ Добавить</button>
        </div>

        <ul className={styles.noteList}>
          {notes.map(note => (
            <li key={note.id} className={styles.noteItem}>
              <span>{note.text}</span>
              <button
                onClick={() => deleteNote(note.id)}
                className={styles.deleteButton}
              >
                🗑️ Удалить
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}