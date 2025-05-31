import {
  FormattedSearchResultContinuation,
  SearchResultSchema,
  SearchResultSong,
} from '@/schemas';

import { formatTextRuns } from './formatTextRuns';

export const formatContinuations = (
  searchResult: SearchResultSchema
): FormattedSearchResultContinuation => {
  if (searchResult.continuationContents) {
    const continuationContents: SearchResultSong[] = [];

    searchResult.continuationContents.musicShelfContinuation.contents.forEach(
      (content) => {
        const videoId =
          content.musicResponsiveListItemRenderer.flexColumns[0]
            .musicResponsiveListItemFlexColumnRenderer.text.runs[0]
            ?.navigationEndpoint?.watchEndpoint;

        if (videoId) {
          continuationContents.push({
            title: formatTextRuns(
              content.musicResponsiveListItemRenderer.flexColumns[0]
                .musicResponsiveListItemFlexColumnRenderer.text.runs
            ),
            subtitle: formatTextRuns(
              content.musicResponsiveListItemRenderer.flexColumns[1]
                ?.musicResponsiveListItemFlexColumnRenderer.text.runs
            ),
            videoId: videoId.videoId,
            thumbnail:
              content.musicResponsiveListItemRenderer.thumbnail
                .musicThumbnailRenderer.thumbnail.thumbnails[0].url,
          });
        }
      }
    );

    return {
      contents: continuationContents,
      continuation:
        searchResult.continuationContents.musicShelfContinuation
          .continuations?.[0]?.nextContinuationData?.continuation,
    };
  }

  return { contents: [] };
};
