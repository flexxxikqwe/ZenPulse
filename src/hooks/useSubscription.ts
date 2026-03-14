import { useState, useEffect } from 'react';

// Simple global-like state for the prototype
let globalSubscribed = false;
const listeners: Array<(val: boolean) => void> = [];

export const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(globalSubscribed);

  useEffect(() => {
    const listener = (val: boolean) => setIsSubscribed(val);
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const setSubscribed = (val: boolean) => {
    globalSubscribed = val;
    listeners.forEach((l) => l(val));
  };

  return { isSubscribed, setSubscribed };
};
