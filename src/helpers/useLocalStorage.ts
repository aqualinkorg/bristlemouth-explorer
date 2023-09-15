import React from 'react';

function getSavedValue<T>(
  key: string,
  initValue: T,
  parseCallback?: (parsedValue: unknown) => T,
) {
  const savedRaw = localStorage.getItem(key);
  const savedJson = JSON.parse(
    savedRaw !== 'undefined' && savedRaw ? savedRaw : 'null',
  );

  if (savedJson && parseCallback) return parseCallback(savedJson);

  return (savedJson || initValue) as T;
}

export default function useLocalStorage<T>(
  key: string,
  initValue: T,
  parseCallback?: (parsedValue: unknown) => T,
) {
  const [value, setValue] = React.useState<T>(() =>
    getSavedValue(key, initValue, parseCallback),
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}
