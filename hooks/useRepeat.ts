import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRepeatMode, switchRepeat } from '@/services';

const QUERY_KEY = ['repeatMode'];

/**
 * Hook to manipulate the repeat mode state.
 * State is not polled to not overload with requests.
 *
 * The repeat mode state is only updated when:
 * - The app is opened
 * - The repeat mode is changed
 */
export const useRepeat = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getRepeatMode,
    initialData: { mode: 'NONE' },
  });

  const { mutateAsync } = useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: switchRepeat,
    onSuccess: () => {
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  return {
    repeatMode: data.mode,
    switchRepeat: async () => {
      await mutateAsync();
    },
  };
};
