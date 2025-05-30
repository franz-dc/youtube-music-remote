import { useQuery } from '@tanstack/react-query';

import { search } from '@/services';

/**
 * Hook to fetch search results based on a query string.
 */
export const useSearch = (query?: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: async () => await search(query ?? ''),
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes, same as default gcTime
  });
