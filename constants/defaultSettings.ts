import { SettingsSchema } from '@/schemas';

// Separated to avoid circular dependencies
export const DEFAULT_SETTINGS: SettingsSchema = {
  // connection
  ipAddress: '',
  port: '26538',
  connectionProfiles: [],
  connectionProfile: 0,
  // appearance
  theme: 'system',
  useMaterialYouColors: true,
  showAlbumArtColor: true,
  showLikeAndDislikeButtons: true,
  showVolumeControl: true,
  showFullScreenButton: true,
  // general
  language: 'system',
  keepScreenOn: false,
  checkForUpdatesOnAppStart: true,
  // extras
  isFreshInstall: false,
} as const;
