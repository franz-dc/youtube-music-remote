export type SearchResultSong = {
  title: string;
  subtitle: string;
  videoId: string;
  thumbnail: string;
};

export type MusicCardShelfRendererTextContent = {
  type: 'text';
  label: string;
};

export type MusicCardShelfRendererSongContent = SearchResultSong & {
  type: 'song';
};

export type MusicCardShelfRendererObj = SearchResultSong & {
  type: 'musicCardShelfRenderer';
  // header: string;
  contents: (
    | MusicCardShelfRendererTextContent
    | MusicCardShelfRendererSongContent
  )[];
};

export type MusicShelfRendererObj = {
  type: 'musicShelfRenderer';
  // header: string;
  contents: SearchResultSong[];
  params?: string;
  continuation?: string;
};

export type FormattedSearchResult = {
  category: string; // YT Music, Library, etc.
  pageType: 'main' | 'category';
  categories: {
    id: string;
    label: string;
  }[];
  contents: (MusicCardShelfRendererObj | MusicShelfRendererObj)[];
};

export type FormattedSearchResultContinuation = {
  contents: SearchResultSong[];
  continuation?: string;
};
