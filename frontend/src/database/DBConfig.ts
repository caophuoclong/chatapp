
export const DBConfig = {
    name: 'ChatApp',
    version: 1,
    objectStoresMeta: [
      {
        store: 'auth',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'token', keypath: 'name', options: { unique: false } },
        ]
      }
    ]
  };