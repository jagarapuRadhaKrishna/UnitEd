type StorageMode = 'local' | 'session';

const localFallback = new Map<string, string>();
const sessionFallback = new Map<string, string>();

const getFallbackStore = (mode: StorageMode) => (mode === 'local' ? localFallback : sessionFallback);

const getBrowserStorage = (mode: StorageMode): Storage | null => {
  if (typeof window === 'undefined') return null;

  try {
    return mode === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

const readStorageValue = (mode: StorageMode, key: string): string | null => {
  const storage = getBrowserStorage(mode);
  if (!storage) {
    return getFallbackStore(mode).get(key) ?? null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return getFallbackStore(mode).get(key) ?? null;
  }
};

const writeStorageValue = (mode: StorageMode, key: string, value: string): void => {
  const storage = getBrowserStorage(mode);
  if (!storage) {
    getFallbackStore(mode).set(key, value);
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {
    getFallbackStore(mode).set(key, value);
  }
};

const removeStorageValue = (mode: StorageMode, key: string): void => {
  const storage = getBrowserStorage(mode);
  if (!storage) {
    getFallbackStore(mode).delete(key);
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    getFallbackStore(mode).delete(key);
  }
};

export const safeLocalStorage = {
  getItem(key: string) {
    return readStorageValue('local', key);
  },
  setItem(key: string, value: string) {
    writeStorageValue('local', key, value);
  },
  removeItem(key: string) {
    removeStorageValue('local', key);
  },
};

export const safeSessionStorage = {
  getItem(key: string) {
    return readStorageValue('session', key);
  },
  setItem(key: string, value: string) {
    writeStorageValue('session', key, value);
  },
  removeItem(key: string) {
    removeStorageValue('session', key);
  },
};
