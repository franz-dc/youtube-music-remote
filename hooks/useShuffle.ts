import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getShuffleState, toggleShuffle } from '@/services';

const QUERY_KEY = ['isShuffle'];

/**
 * Hook to manipulate the shuffle state.
 * State is not polled to not overload with requests.
 *
 * The shuffle state is only updated when:
 * - The app is opened
 * - Shuffle button is pressed
 */
export const useShuffle = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getShuffleState,
    initialData: false,
  });

  const { mutateAsync } = useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: toggleShuffle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  return {
    isShuffle: data,
    toggleShuffle: async () => {
      await mutateAsync();
    },
  };
};
