import { useCallback, useEffect, useState } from 'react';

export function useDayNight() {
  const [night, setNight] = useState(false);

  const enableNight = useCallback(() => setNight(true), []);
  const enableDay   = useCallback(() => setNight(false), []);
  const toggle      = useCallback(() => setNight(n => !n), []);

  useEffect(() => {
    const saved = localStorage.getItem('night_mode');
    if (saved) setNight(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('night_mode', String(night));
  }, [night]);

  return { night, enableNight, enableDay, toggle };
}
