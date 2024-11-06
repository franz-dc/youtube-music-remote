import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { getFullScreen, setFullScreen } from '@/services';

const QUERY_KEY = ['isFullscreen'];

export const useIsFullScreen = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: getFullScreen,
    initialData: false,
  });

export const useSetFullScreen = (
  options?: UseMutationOptions<unknown, Error, boolean, unknown>
) =>
  useMutation({
    ...options,
    mutationKey: QUERY_KEY,
    mutationFn: setFullScreen,
  });
