import { Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';

import { TextDialogProps } from '@/components';
import { SettingsSchema } from '@/schemas';

// Languages - should be sorted in English alphabetical order
export const LANGUAGES = ['en', 'ja'] as const;

// Settings
export const SETTINGS_KEYS = [
  // connection
  'ipAddress',
  'port',
  // appearance
  'theme',
  'useMaterialYouColors',
  'showAlbumArtColor',
  'showLikeAndDislikeButtons',
  'showVolumeControl',
  'showFullScreenButton',
  // general
  'language',
] as const satisfies (keyof SettingsSchema)[];

export const SETTINGS_OPTIONS = {
  theme: ['system', 'light', 'dark', 'black'],
  language: ['system', ...LANGUAGES],
} as const satisfies Partial<Record<keyof SettingsSchema, string[]>>;

export const DEFAULT_SETTINGS = {
  // connection
  ipAddress: '',
  port: '26538',
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
} as const satisfies SettingsSchema;

export const TEXT_SETTINGS: Record<
  string,
  {
    category: string;
    required?: boolean;
    validation?: TextDialogProps['validation'];
    withHelperText?: boolean;
    numeric?: boolean;
  }
> = {
  ipAddress: {
    category: 'connection',
    required: true,
    validation: (value) => {
      if (
        !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value) &&
        value !== 'localhost'
      )
        return 'settings.connection.invalidIpAddress';
      return null;
    },
    withHelperText: true,
  },
  port: {
    category: 'connection',
    required: true,
    validation: (value) => {
      if (isNaN(+value)) return 'settings.connection.invalidPort';
      if (+value < 0 || +value > 65535)
        return 'settings.connection.invalidPortRange';
      return null;
    },
    withHelperText: true,
    numeric: true,
  },
};

export const OPTION_SETTINGS: Record<
  string,
  {
    category: string;
    options: string[];
    optionI18nPrefix: string;
  }
> = {
  theme: {
    category: 'appearance',
    options: SETTINGS_OPTIONS.theme,
    optionI18nPrefix: 'themes',
  },
  language: {
    category: 'general',
    options: SETTINGS_OPTIONS.language,
    optionI18nPrefix: 'languages',
  },
};

// App
export const SAFE_LOW_VOLUME = 0.1;
export const MINI_PLAYER_HEIGHT = 64;
export const MINI_PLAYER_ALBUM_ART_WIDTH = MINI_PLAYER_HEIGHT - 20; // 10 vertical padding
export const MORE_ICON =
  Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
export const ANIMATION_CONFIGS = {
  duration: 350,
  easing: Easing.out(Easing.exp),
};
export const APP_FILE_EXTENSION = Platform.select({
  ios: 'ipa',
  android: 'apk',
});
