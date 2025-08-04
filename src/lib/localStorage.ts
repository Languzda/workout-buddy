// utils/localStorage.ts

/**
 * Zapisuje obiekt JSON do localStorage pod wskazaną nazwą.
 * @param key Nazwa zmiennej w localStorage.
 * @param data Obiekt JSON do zapisania.
 */
export function saveLocal<T>(key: string, data: T): void {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
  } catch (err) {
    console.error(`Błąd podczas zapisu do localStorage [${key}]:`, err);
  }
}

/**
 * Wczytuje i parsuje obiekt JSON z localStorage.
 * @param key Nazwa zmiennej do pobrania.
 * @returns Zwraca sparsowany obiekt lub null, jeśli brak danych.
 */
export function loadLocal<T>(key: string): T | null {
  try {
    const json = localStorage.getItem(key);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch (err) {
    console.error(`Błąd podczas odczytu z localStorage [${key}]:`, err);
    return null;
  }
}
