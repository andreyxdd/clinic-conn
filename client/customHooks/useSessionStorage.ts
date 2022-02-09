import { useEffect, useState } from 'react';
import isBrowser from '../utils/isBrowser';

function useSessionStorage <T>(
  key: string,
  initialValue?: T,
  raw?: boolean,
// eslint-disable-next-line no-unused-vars
): [T, (value: T) => void] {
  if (!isBrowser) {
    return [initialValue as T, () => {}];
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = useState<T>(() => {
    try {
      const sessionStorageValue = sessionStorage.getItem(key);
      if (typeof sessionStorageValue !== 'string') {
        sessionStorage.setItem(key, raw ? String(initialValue) : JSON.stringify(initialValue));
        return initialValue;
      }
      return raw ? sessionStorageValue : JSON.parse(sessionStorageValue || 'null');
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isBrowser) {
      try {
        const serializedState = raw ? String(state) : JSON.stringify(state);
        sessionStorage.setItem(key, serializedState);
      } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. Also JSON.stringify can throw.
      }
    }
  });

  return [state, setState];
}

export default useSessionStorage;
