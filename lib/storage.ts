const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readStorageItem = (key: string) => {
  if (!canUseStorage()) {
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
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}"`, error);
  }
};

export const removeStorageItem = (key: string) => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}"`, error);
  }
};
