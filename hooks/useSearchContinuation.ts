import { useQuery } from '@tanstack/react-query';

import { search } from '@/services';
import { formatContinuations } from '@/utils/formatSearchContinuations';

/**
 * Hook to fetch search results with continuations.
 */
export const useSearchContinuation = (params: {
  query?: string;
  params?: string; // unused, but kept for consistency
  continuation?: string;
}) =>
  useQuery({
    queryKey: ['search', params],
    queryFn: async () => await search(params.query ?? ''),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes, same as default gcTime
    select: formatContinuations,
  });
