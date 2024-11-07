export type SettingsSchema = {
  // connection
  host: string;
  port: string;
  // appearance
  theme: string;
  showAlbumArtColor: boolean;
  showLikeAndDislikeButtons: boolean;
  showVolumeControl: boolean;
  showFullScreenButton: boolean;
  // general
  language: string;
};
