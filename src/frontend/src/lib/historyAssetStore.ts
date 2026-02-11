const DB_NAME = 'PNDAssetStore';
const DB_VERSION = 1;
const STORE_NAME = 'assets';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveAssetToStore(blob: Blob, type: string): Promise<string> {
  const db = await openDB();
  const assetId = `${type}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(blob, assetId);

    request.onsuccess = () => resolve(assetId);
    request.onerror = () => reject(request.error);
  });
}

export async function getAssetFromStore(assetId: string): Promise<Blob | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(assetId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}
