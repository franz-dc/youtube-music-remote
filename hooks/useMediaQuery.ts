import { useWindowDimensions } from 'react-native';

import { breakpoints } from '@/constants';

/**
 * Hook to check if the current window dimensions match a given media query.
 */
export const useMediaQuery = (query: keyof typeof breakpoints): boolean => {
  const { width } = useWindowDimensions();
  return width >= breakpoints[query];
};
