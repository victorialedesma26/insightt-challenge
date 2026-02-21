const TOKEN_STORAGE_KEY = 'taskflow:access_token';

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

export const getStoredToken = (): string | null => {
  const storage = getStorage();
  return storage ? storage.getItem(TOKEN_STORAGE_KEY) : null;
};

export const setStoredToken = (token: string) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearStoredToken = () => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(TOKEN_STORAGE_KEY);
};
