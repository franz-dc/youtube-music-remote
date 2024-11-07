import { SettingsSchema } from '@/schemas';

// Languages - should be sorted in English alphabetical order
export const LANGUAGES = ['en', 'ja'] as const;

// Settings
export const SETTINGS_KEYS = [
  // connection
  'host',
  'port',
  // appearance
  'theme',
  'showAlbumArtColor',
  'showLikeAndDislikeButtons',
  'showVolumeControl',
  'showFullScreenButton',
  // general
  'language',
] as const satisfies (keyof SettingsSchema)[];

export const SETTINGS_OPTIONS = {
  theme: ['system', 'light', 'dark'],
  language: ['system', ...LANGUAGES],
} satisfies Partial<Record<keyof SettingsSchema, string[]>>;

export const DEFAULT_SETTINGS = {
  // connection
  host: '',
  port: '26538',
  // appearance
  theme: 'system',
  showAlbumArtColor: true,
  showLikeAndDislikeButtons: true,
  showVolumeControl: true,
  showFullScreenButton: true,
  // general
  language: 'system',
} as const satisfies SettingsSchema;

// App
export const DOMINANT_COLOR_FALLBACK = '#000000';
export const SAFE_LOW_VOLUME = 10;
