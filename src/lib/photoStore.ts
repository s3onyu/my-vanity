/**
 * 사진 저장소 (IndexedDB) — localStorage 는 5MB 안팎이라 사진을 넣기엔 좁다.
 * 로컬 모드에서 제품 사진·피부 사진의 data URL 을 여기에 두고, JSON 에는 키만 남긴다.
 * IndexedDB 를 쓸 수 없는 환경에서는 조용히 실패하고 호출부가 localStorage 로 대신한다.
 */

const DB_NAME = 'my-vanity';
const STORE = 'photos';
const VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB 사용 불가'));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB 열기 실패'));
  }).catch((err) => {
    dbPromise = null;
    throw err;
  }) as Promise<IDBDatabase>;
  return dbPromise;
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = run(t.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error('IndexedDB 오류'));
      }),
  );
}

export const isPhotoStoreAvailable = () => typeof indexedDB !== 'undefined';

export function putPhoto(key: string, dataUrl: string): Promise<void> {
  return tx<IDBValidKey>('readwrite', (s) => s.put(dataUrl, key)).then(() => undefined);
}

export function getPhoto(key: string): Promise<string | null> {
  return tx<string | undefined>('readonly', (s) => s.get(key)).then((v) => v ?? null);
}

export function deletePhoto(key: string): Promise<void> {
  return tx<undefined>('readwrite', (s) => s.delete(key)).then(() => undefined);
}

/** 접두사(예: 'product:')로 시작하는 모든 사진을 { 키 뒷부분: dataUrl } 로 돌려준다 */
export async function listPhotos(prefix: string): Promise<Record<string, string>> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const out: Record<string, string> = {};
    const range = IDBKeyRange.bound(prefix, `${prefix}￿`);
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) {
        resolve(out);
        return;
      }
      out[String(cursor.key).slice(prefix.length)] = cursor.value as string;
      cursor.continue();
    };
    req.onerror = () => reject(req.error ?? new Error('IndexedDB 오류'));
  });
}
