import { useEffect, useMemo } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useSettingAtom } from '@/configs';
import { getQueue, getSongInfo } from '@/services';

import { usePrevious } from './usePrevious';

const POLLING_RATE = 1000; // 1 second

/**
 * Separate hook to fetch the now playing song elapsed seconds.
 *
 * This is done due to prevent unnecessary re-renders when the song elapsed
 * seconds changes.
 */
export const useNowPlayingElapsedSeconds = () =>
  useQuery<unknown, Error, number>({
    queryKey: ['nowPlayingElapsedSeconds'],
    // Placeholder function, as this is only used for cache management
    queryFn: () => 0,
  });

/**
 * Fetches the current song information at a regular interval.
 * Polling is done due to the nature of the REST API.
 */
export const useNowPlaying = () => {
  const [ipAddress] = useSettingAtom('ipAddress');
  const [port] = useSettingAtom('port');

  const enabled = !!ipAddress && !!port;
  const prevIpAddress = usePrevious(ipAddress);
  const prevPort = usePrevious(port);

  const queryClient = useQueryClient();

  const useQueryResult = useQuery({
    queryKey: ['nowPlaying'],
    queryFn: getSongInfo,
    refetchInterval: (query) => (query.state.error ? false : POLLING_RATE),
    retry: false,
    select: (data) => {
      if (!data) return null;
      // Remove elapsed seconds from the data to prevent unnecessary re-renders
      const { elapsedSeconds, ...rest } = data;
      // If the elapsed seconds were updated more than a set fraction of
      // POLLING_RATE ago, update the query cache with the current song elapsed
      // seconds. This reduces the occurrences of seek lag or jumps.
      const elapsedSecondsUpdatedAt = queryClient.getQueryState([
        'nowPlayingElapsedSeconds',
      ])?.dataUpdatedAt;
      if (
        !elapsedSecondsUpdatedAt ||
        Date.now() - elapsedSecondsUpdatedAt > POLLING_RATE / 4
      ) {
        queryClient.setQueryData(['nowPlayingElapsedSeconds'], elapsedSeconds);
      }
      return rest;
    },
    enabled,
  });

  const { data, isSuccess, refetch, isRefetchError } = useQueryResult;

  const { isError: isErrorQueue, refetch: refetchQueue } = useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
    retry: false,
    enabled: enabled && isSuccess,
  });

  // Refetch song info when queue came from isError to !isError
  useEffect(() => {
    if (!isErrorQueue) {
      refetch();
    }
  }, [isErrorQueue, refetch]);

  // Refetch everything when connection settings change
  useEffect(() => {
    if (isRefetchError) return;
    if (prevIpAddress === ipAddress && prevPort === port) return;

    const refetchQueries = async () => {
      await refetchQueue();
      await refetch();
    };

    refetchQueries();
  }, [
    ipAddress,
    port,
    prevIpAddress,
    prevPort,
    refetchQueue,
    refetch,
    isRefetchError,
  ]);

  const currentSongId = useMemo(() => data?.videoId, [data?.videoId]);

  // Refetch the queue when the song changes
  useEffect(() => {
    if (!enabled || !isSuccess) return;
    refetchQueue({
      cancelRefetch: false,
    });
  }, [currentSongId, refetchQueue, enabled, isSuccess]);

  return useQueryResult;
};
