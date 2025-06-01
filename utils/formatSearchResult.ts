import {
  FormattedSearchResult,
  MusicCardShelfRendererObj,
  MusicCardShelfRendererSongContent,
  MusicCardShelfRendererTextContent,
  MusicShelfRendererObj,
  SearchResultSchema,
  SearchResultSong,
} from '@/schemas';

import { formatTextRuns } from './formatTextRuns';

/**
 * Format search results from the YouTube Music API into a more usable format.
 *
 * This is a partial implementation, only focusing on music-related search
 * results.
 *
 * This is an interpretation of how the responses work based on a few samples.
 * It is not yet guaranteed to be complete or accurate for all possible search
 * results, especially search results with YouTube Premium content.
 * It may need adjustments due to the lack of a source schema.
 */
export const formatSearchResult = (
  searchResult: SearchResultSchema
): FormattedSearchResult[] => {
  // Main search results & category (pressing "Show more")
  if (searchResult.contents) {
    return searchResult.contents?.tabbedSearchResultsRenderer.tabs.map(
      (tab) => ({
        category: tab.tabRenderer.title,
        pageType: tab.tabRenderer.content.sectionListRenderer.contents?.some(
          (content) => !!content.musicCardShelfRenderer
        )
          ? 'main'
          : 'category',
        contents:
          tab.tabRenderer.content.sectionListRenderer.contents
            ?.map(
              (
                content
              ): MusicCardShelfRendererObj | MusicShelfRendererObj | null => {
                // musicCardShelfRenderer - e.g. "Top result"
                if (content.musicCardShelfRenderer) {
                  const watchEndpoint =
                    content.musicCardShelfRenderer.title.runs[0]
                      .navigationEndpoint?.watchEndpoint;

                  if (!watchEndpoint) return null;

                  return {
                    type: 'musicCardShelfRenderer',
                    header: formatTextRuns(
                      content.musicCardShelfRenderer.header
                        .musicCardShelfHeaderBasicRenderer.title.runs
                    ),
                    title: formatTextRuns(
                      content.musicCardShelfRenderer.title.runs
                    ),
                    subtitle: formatTextRuns(
                      content.musicCardShelfRenderer.subtitle.runs
                    ),
                    videoId: watchEndpoint.videoId,
                    thumbnail:
                      content.musicCardShelfRenderer.thumbnail
                        .musicThumbnailRenderer.thumbnail.thumbnails[0].url,
                    contents:
                      content.musicCardShelfRenderer.contents
                        ?.map((content) => {
                          if (content.messageRenderer) {
                            return {
                              type: 'text',
                              label: content.messageRenderer.text.runs[0].text,
                            };
                          } else if (content.musicResponsiveListItemRenderer) {
                            return {
                              type: 'song',
                              title: formatTextRuns(
                                content.musicResponsiveListItemRenderer
                                  .flexColumns[0]
                                  .musicResponsiveListItemFlexColumnRenderer
                                  .text.runs
                              ),
                              subtitle: formatTextRuns(
                                content.musicResponsiveListItemRenderer
                                  .flexColumns[1]
                                  ?.musicResponsiveListItemFlexColumnRenderer
                                  .text.runs
                              ),
                              videoId:
                                content.musicResponsiveListItemRenderer
                                  .flexColumns[0]
                                  .musicResponsiveListItemFlexColumnRenderer
                                  .text.runs[0].navigationEndpoint
                                  ?.watchEndpoint?.videoId,
                              thumbnail:
                                content.musicResponsiveListItemRenderer
                                  .thumbnail.musicThumbnailRenderer.thumbnail
                                  .thumbnails[0].url,
                            };
                          }
                        })
                        .filter(
                          (
                            item
                          ): item is
                            | MusicCardShelfRendererTextContent
                            | MusicCardShelfRendererSongContent => !!item
                        ) || [],
                  };
                }

                // musicShelfRenderer - e.g. "Songs", "Videos", "Albums", etc.
                if (content.musicShelfRenderer) {
                  const musicShelfRendererContents: SearchResultSong[] = [];

                  content.musicShelfRenderer?.contents.forEach((content) => {
                    // Filter out items without videoId (playlists, artists, etc.)
                    const videoId =
                      content.musicResponsiveListItemRenderer.flexColumns[0]
                        .musicResponsiveListItemFlexColumnRenderer.text.runs[0]
                        .navigationEndpoint?.watchEndpoint?.videoId;

                    if (!videoId) return;

                    musicShelfRendererContents.push({
                      title:
                        content.musicResponsiveListItemRenderer.flexColumns[0]
                          .musicResponsiveListItemFlexColumnRenderer.text
                          .runs[0].text,
                      subtitle: formatTextRuns(
                        content.musicResponsiveListItemRenderer.flexColumns[1]
                          ?.musicResponsiveListItemFlexColumnRenderer.text.runs
                      ),
                      videoId,
                      thumbnail:
                        content.musicResponsiveListItemRenderer.thumbnail
                          .musicThumbnailRenderer.thumbnail.thumbnails[0].url,
                    });
                  });

                  // Do not show empty musicShelfRenderer
                  if (
                    !musicShelfRendererContents ||
                    musicShelfRendererContents.length === 0
                  ) {
                    return null;
                  }

                  return {
                    type: 'musicShelfRenderer',
                    header: content.musicShelfRenderer?.title.runs[0].text,
                    contents: musicShelfRendererContents,
                    params:
                      content.musicShelfRenderer?.bottomEndpoint?.searchEndpoint
                        .params,
                    continuation:
                      content.musicShelfRenderer?.continuations?.[0]
                        ?.nextContinuationData?.continuation,
                  };
                }

                return null;
              }
            )
            .filter((item): item is NonNullable<typeof item> => !!item) || [],
      })
    );
  }

  return [];
};
