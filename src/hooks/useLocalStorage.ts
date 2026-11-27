import { useEffect, useState } from "react";

// key          : le nom sous lequel on range la valeur
// initialValue : la valeur de départ si rien n'est encore rangé
// isValid      : vérifie que la valeur relue est correcte
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return initialValue;

      const parsed: unknown = JSON.parse(saved);
      if (isValid && !isValid(parsed)) return initialValue;
      return parsed as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}
