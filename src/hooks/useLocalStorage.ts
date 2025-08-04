import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const json = localStorage.getItem(key);
      return json ? (JSON.parse(json) as T) : initialValue;
    } catch (err) {
      console.error(`Błąd odczytu localStorage [${key}]:`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Błąd zapisu do localStorage [${key}]:`, err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
