import { useQuery } from '@tanstack/react-query';

import { search } from '@/services';
import { formatSearchResult } from '@/utils';

/**
 * Hook to fetch search results based on a query string.
 *
 * Also used for getting continuation results when pressing "Show more" in the
 * search results.
 */
export const useSearch = (params: {
  query?: string;
  params?: string;
  continuation?: string;
}) =>
  useQuery({
    queryKey: ['search', params],
    queryFn: async () => await search(params.query ?? ''),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes, same as default gcTime
    select: formatSearchResult,
  });
