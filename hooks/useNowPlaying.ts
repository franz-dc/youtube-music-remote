import { useEffect, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getQueue, getSongInfo } from '@/services';

const POLLING_RATE = 1000; // 1 second

/**
 * Fetches the current song information at a regular interval.
 * Polling is done due to the nature of the REST API.
 */
export const useNowPlaying = () => {
  const { refetch: refetchQueue } = useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
  });

  const useQueryResult = useQuery({
    queryKey: ['nowPlaying'],
    queryFn: getSongInfo,
    refetchInterval: POLLING_RATE,
  });

  const currentSongId = useMemo(
    () => useQueryResult.data?.videoId,
    [useQueryResult.data?.videoId]
  );

  // Refetch the queue when the song changes
  useEffect(() => {
    refetchQueue();
  }, [currentSongId, refetchQueue]);

  return useQueryResult;
};
