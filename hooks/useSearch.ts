import { useQuery } from '@tanstack/react-query';

import { search } from '@/services';
import { formatSearchResult } from '@/utils';

/**
 * Hook to fetch search results based on a query string.
 *
 * For search results within a specific category, use `useCategorySearch`
 * instead.
 */
export const useSearch = (params: { query?: string }) =>
  useQuery({
    queryKey: ['search', params],
    queryFn: async () =>
      await search({
        query: params.query || '',
      }),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes, same as default gcTime
    select: formatSearchResult,
  });
