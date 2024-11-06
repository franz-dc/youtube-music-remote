import { useQuery } from '@tanstack/react-query';

import { getQueue } from '@/services';

/**
 * Fetches the current queue of songs.
 * The queue cache is re-fetched on song change.
 *
 * Song info is not polled here as `BottomNavigation` keeps the player
 * screen (with `useNowPlaying`) rendered.
 */
export const useQueue = () =>
  useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
  });
