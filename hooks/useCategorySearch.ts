import { useInfiniteQuery } from '@tanstack/react-query';

import { FormattedSearchResult, SearchResultSong } from '@/schemas';
import { search } from '@/services';
import { formatSearchResult } from '@/utils';
import { formatContinuations } from '@/utils/formatSearchContinuations';

/**
 * Hook to fetch search results within a specific category.
 */
export const useCategorySearch = (params: {
  query?: string;
  params?: string;
}) =>
  useInfiniteQuery({
    queryKey: ['categorizedSearch', params],
    queryFn: async ({
      pageParam,
    }): Promise<{
      contents: SearchResultSong[];
      continuation?: string;
    }> => {
      const data = await search({
        query: params.query || '',
        params: params.params,
        continuation: pageParam,
      });

      if (data.contents) {
        return formatSearchResult(data)?.[0].contents.filter(
          (
            content
          ): content is Extract<
            FormattedSearchResult['contents'][number],
            { type: 'musicShelfRenderer' }
          > => content.type === 'musicShelfRenderer'
        )[0];
      } else if (data.continuationContents) {
        return formatContinuations(data);
      } else {
        return { contents: [] };
      }
    },
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes, same as default gcTime
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.continuation,
  });
