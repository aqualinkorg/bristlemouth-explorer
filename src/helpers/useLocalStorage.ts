import React from 'react';

function getSavedValue(key: string, initValue: unknown) {
  const savedRaw = localStorage.getItem(key);
  const savedJson = JSON.parse(
    savedRaw !== 'undefined' && savedRaw ? savedRaw : 'null',
  );

  return savedJson || initValue;
}

export default function useLocalStorage<T>(key: string, initValue: T) {
  const [value, setValue] = React.useState<T>(() =>
    getSavedValue(key, initValue),
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}
