import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getQueue, getSongInfo } from '@/services';

import { useSettings } from './useSettings';

const POLLING_RATE = 1000; // 1 second

/**
 * Fetches the current song information at a regular interval.
 * Polling is done due to the nature of the REST API.
 */
export const useNowPlaying = () => {
  const { settings } = useSettings();

  const enabled = !!settings.ipAddress && !!settings.port;

  const [refetchInterval, setRefetchInterval] = useState(POLLING_RATE);

  const { refetch: refetchQueue } = useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
    retry: false,
    enabled,
  });

  const useQueryResult = useQuery({
    queryKey: ['nowPlaying'],
    queryFn: getSongInfo,
    refetchInterval,
    retry: false,
    enabled,
  });

  useEffect(() => {
    if (useQueryResult.error) {
      setRefetchInterval(Infinity);
    }
  }, [useQueryResult.error]);

  const currentSongId = useMemo(
    () => useQueryResult.data?.videoId,
    [useQueryResult.data?.videoId]
  );

  // Refetch the queue when the song changes
  useEffect(() => {
    if (!enabled) return;
    refetchQueue();
  }, [currentSongId, refetchQueue, enabled]);

  return useQueryResult;
};
