import { createContext } from 'react';
const DatabaseContenxt = createContext({} as IDBDatabase | null);

export default DatabaseContenxt;
