import React from 'react';
import DatabaseContenxt from '../context/DatabaseContext';
import { useEffect, useState } from 'react';
type Props = {
  children: React.ReactNode;
};

export default function LocalDatabaseProvider({ children }: Props) {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  useEffect(() => {
    const db1 = window.indexedDB.open('chat-app');
    db1.onsuccess = (e: any) => {
      setDb(e.target.result);
    };
    db1.onupgradeneeded = (e: any) => {
      const xyz = db1.result;
      console.log(xyz);
      xyz.createObjectStore('messages', { keyPath: 'id' });
      xyz.createObjectStore('contacts', { keyPath: 'id' });
      xyz.createObjectStore('conversations', { keyPath: 'id' });
      xyz.createObjectStore('auth');
      setDb(xyz);
    };
  }, []);
  useEffect(() => {
    if (db) {
      db.onversionchange = (ev: IDBVersionChangeEvent) => {
        console.log(ev);
      };
    }
  }, [db]);

  return (
    <DatabaseContenxt.Provider value={db}>{children}</DatabaseContenxt.Provider>
  );
}
