import { useState } from 'react';

export const useDelay = (ms: number) => {
  const [isReady, setIsReady] = useState(false);

  setTimeout(() => {
    setIsReady(true);
  }, ms);

  return isReady;
};
