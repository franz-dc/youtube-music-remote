import { SETTINGS_OPTIONS } from '@/constants';

export type SettingsSchema = {
  // connection
  ipAddress: string;
  port: string;
  connectionProfiles: {
    ipAddress: string;
    port: string;
  }[];
  connectionProfile: number;
  // appearance
  theme: (typeof SETTINGS_OPTIONS.theme)[number];
  useMaterialYouColors: boolean;
  showAlbumArtColor: boolean;
  showLikeAndDislikeButtons: boolean;
  showVolumeControl: boolean;
  showFullScreenButton: boolean;
  // general
  language: (typeof SETTINGS_OPTIONS.language)[number];
  keepScreenOn: boolean;
  checkForUpdatesOnAppStart: boolean;
  // extras
  isFreshInstall: boolean;
};
