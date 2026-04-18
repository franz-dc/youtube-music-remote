import { useQuery } from '@tanstack/react-query';

import { useSettingAtom } from '@/configs';
import { getQueue } from '@/services';

/**
 * Fetches the current queue of songs.
 * The queue cache is re-fetched on song change.
 *
 * Song info is not polled here as `BottomNavigation` keeps the player
 * screen (with `useNowPlaying`) rendered.
 */
export const useQueue = () => {
  const [ipAddress] = useSettingAtom('ipAddress');

  const enabled = !!ipAddress;

  const useQueryResult = useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
    retry: false,
    enabled,
  });

  return useQueryResult;
};
