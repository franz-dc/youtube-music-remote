import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getQueue, getSongInfo } from '@/services';

import { usePrevious } from './usePrevious';
import { useSettings } from './useSettings';

const POLLING_RATE = 1000; // 1 second

/**
 * Fetches the current song information at a regular interval.
 * Polling is done due to the nature of the REST API.
 */
export const useNowPlaying = () => {
  const { settings } = useSettings();

  const enabled = !!settings.ipAddress && !!settings.port;
  const prevIpAddress = usePrevious(settings.ipAddress);
  const prevPort = usePrevious(settings.port);

  const [refetchInterval, setRefetchInterval] = useState(POLLING_RATE);

  const useQueryResult = useQuery({
    queryKey: ['nowPlaying'],
    queryFn: getSongInfo,
    refetchInterval,
    retry: false,
    enabled,
  });

  const { data, isSuccess, isError, refetch, isRefetchError } = useQueryResult;

  const { isError: isErrorQueue, refetch: refetchQueue } = useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
    retry: false,
    enabled: enabled && isSuccess,
  });

  useEffect(() => {
    setRefetchInterval(isError ? Infinity : POLLING_RATE);
  }, [isError]);

  // Refetch song info when queue came from isError to !isError
  useEffect(() => {
    if (!isErrorQueue) {
      refetch();
    }
  }, [isErrorQueue, refetch]);

  // Refetch everything when connection settings change
  useEffect(() => {
    if (isRefetchError) return;
    if (prevIpAddress === settings.ipAddress && prevPort === settings.port)
      return;

    const refetchQueries = async () => {
      await refetchQueue();
      await refetch();
    };

    refetchQueries();
  }, [
    settings.ipAddress,
    settings.port,
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
