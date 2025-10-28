import { useQuery, useQueryClient } from '@tanstack/react-query';

export const usePlay = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery<unknown, Error, boolean>({
    queryKey: ['isPlaying'],
    // Placeholder function, as this is only used for cache management
    queryFn: () => queryClient.getQueryData<boolean>(['isPlaying']) || false,
    initialData: false,
  });

  return {
    isPlaying: data ?? false,
  };
};
