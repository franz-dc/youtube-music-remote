export type SongInfoSchema = {
  title: string;
  artist: string;
  views: number;
  uploadDate: string;
  imageSrc?: string | null;
  isPaused: boolean;
  songDuration: number;
  elapsedSeconds?: number;
  url: string;
  album?: string | null;
  videoId: string;
  playlistId: string;
  mediaType:
    | 'AUDIO'
    | 'ORIGINAL_MUSIC_VIDEO'
    | 'USER_GENERATED_CONTENT'
    | 'PODCAST_EPISODE'
    | 'OTHER_VIDEO';
} | null;
