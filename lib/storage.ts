export const isStorageAvailable = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readStorageItem = (key: string) => {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}"`, error);
    return null;
  }
};

export const writeStorageItem = (key: string, value: string) => {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}"`, error);
  }
};

export const removeStorageItem = (key: string) => {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}"`, error);
  }
};

export const listStorageKeys = () => {
  if (!isStorageAvailable()) {
    return [] as string[];
  }

  try {
    return Array.from({ length: window.localStorage.length }, (_, index) => window.localStorage.key(index)).filter(
      (key): key is string => Boolean(key)
    );
  } catch (error) {
    console.error('Failed to list localStorage keys', error);
    return [] as string[];
  }
};
