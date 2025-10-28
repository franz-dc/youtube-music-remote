import { useQuery, useQueryClient } from '@tanstack/react-query';

const QUERY_KEY = ['isShuffle'];

export const useShuffle = () => {
  const queryClient = useQueryClient();

  const { data: isShuffle } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => queryClient.getQueryData<boolean>(QUERY_KEY) || false,
    initialData: false,
  });

  return { isShuffle };
};
