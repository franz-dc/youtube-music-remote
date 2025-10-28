import { useQuery, useQueryClient } from '@tanstack/react-query';

import { RepeatMode } from '@/schemas';

const QUERY_KEY = ['repeatMode'];

export const useRepeat = () => {
  const queryClient = useQueryClient();

  const { data: repeatMode } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      queryClient.getQueryData<RepeatMode>(QUERY_KEY) || RepeatMode.NONE,
    initialData: RepeatMode.NONE,
  });

  return { repeatMode };
};
