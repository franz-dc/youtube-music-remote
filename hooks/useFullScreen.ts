import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { PLAYER_STATE_POLLING_INTERVAL_MS } from '@/constants';
import { getFullScreen, setFullScreen } from '@/services';

const QUERY_KEY = ['isFullscreen'];

export const useIsFullScreen = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: getFullScreen,
    initialData: false,
    refetchInterval: PLAYER_STATE_POLLING_INTERVAL_MS,
  });

export const useSetFullScreen = (
  options?: UseMutationOptions<unknown, Error, boolean, unknown>
) =>
  useMutation({
    ...options,
    mutationKey: QUERY_KEY,
    mutationFn: setFullScreen,
  });
