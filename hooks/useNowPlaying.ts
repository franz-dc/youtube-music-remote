import { useCallback, useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import { seekBarValueAtom, useSettingAtom } from '@/configs';
import { SongInfoSchema } from '@/schemas';

/**
 * Separate hook to fetch the now playing song elapsed seconds.
 *
 * This is done due to prevent unnecessary re-renders when the song elapsed
 * seconds changes.
 */
export const useNowPlayingElapsedSeconds = () => {
  const queryClient = useQueryClient();

  const getSeekBarValue = useCallback(() => {
    const elapsedSeconds =
      queryClient.getQueryData<number>(['nowPlayingElapsedSeconds']) || 0;
    const duration =
      queryClient.getQueryData<SongInfoSchema>(['nowPlaying'])?.songDuration ||
      1;
    return elapsedSeconds / duration;
  }, [queryClient]);

  const [seekBarValue, setSeekBarValue] = useAtom(seekBarValueAtom);

  // init seek bar value
  useEffect(() => {
    setSeekBarValue(getSeekBarValue());
  }, [getSeekBarValue, setSeekBarValue]);

  const { data: elapsedSeconds } = useQuery<unknown, Error, number>({
    queryKey: ['nowPlayingElapsedSeconds'],
    // Placeholder function, as this is only used for cache management
    queryFn: () =>
      queryClient.getQueryData<number>(['nowPlayingElapsedSeconds']),
    initialData: 0,
  });

  return {
    elapsedSeconds,
    seekBarValue,
    setSeekBarValue,
  };
};

/**
 * Hook to get the currently playing song info.
 *
 * Also handles refetching when connection settings change.
 */
export const useNowPlaying = () => {
  const queryClient = useQueryClient();
  const [ipAddress] = useSettingAtom('ipAddress');
  const [port] = useSettingAtom('port');

  const enabled = !!ipAddress && !!port;

  const useQueryResult = useQuery({
    queryKey: ['nowPlaying'],
    // Placeholder function, as this is only used for cache management
    queryFn: () => queryClient.getQueryData<SongInfoSchema>(['nowPlaying']),
    initialData: null,
    retry: false,
    enabled,
  });

  return useQueryResult;
};
