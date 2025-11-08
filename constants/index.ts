import { TFunction } from 'i18next';
import { Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';

import { TextDialogProps } from '@/components';
import { settingAtomFamily, store } from '@/configs';
import { SettingsSchema } from '@/schemas';

// External
export * from './breakpoints';
export * from './defaultSettings';

// Languages - should be sorted in English alphabetical order
export const LANGUAGES = ['en', 'ja'] as const;

// Settings
export const MIN_CONNECTION_PROFILES = 5;

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
    options: (string | number)[];
    optionI18nPrefix: string;
    labelGetter?: (option: any, t: TFunction) => string; // with settings prefix
  }
> = {
  connectionProfile: {
    category: 'connection',
    options: Array.from({ length: MIN_CONNECTION_PROFILES }, (_, i) => i),
    optionI18nPrefix: 'profileNumbers',
    labelGetter: (option: number, t) =>
      t('connection.profileNumber', { number: option + 1 }),
  },
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

export const SETTING_CHANGE_CALLBACKS: Partial<
  Record<keyof SettingsSchema, (newValue: any) => void | Promise<void>>
> = {
  connectionProfile: (newValue: number) => {
    const connectionProfile = store.get(
      settingAtomFamily('connectionProfiles')
    )[newValue];

    if (!connectionProfile) return;

    store.set(settingAtomFamily('ipAddress'), connectionProfile.ipAddress);
    store.set(settingAtomFamily('port'), connectionProfile.port);
  },
  ipAddress: (newValue: string) => {
    const connectionProfileIndex = store.get(
      settingAtomFamily('connectionProfile')
    );

    const connectionProfiles = store.get(
      settingAtomFamily('connectionProfiles')
    );

    if (!connectionProfiles[connectionProfileIndex]) return;

    const updatedProfiles = connectionProfiles.map((profile, index) =>
      index === connectionProfileIndex
        ? { ...profile, ipAddress: newValue }
        : profile
    );

    store.set(settingAtomFamily('connectionProfiles'), updatedProfiles);
  },
  port: (newValue: string) => {
    const connectionProfileIndex = store.get(
      settingAtomFamily('connectionProfile')
    );

    const connectionProfiles = store.get(
      settingAtomFamily('connectionProfiles')
    );

    if (!connectionProfiles[connectionProfileIndex]) return;

    const updatedProfiles = connectionProfiles.map((profile, index) =>
      index === connectionProfileIndex
        ? { ...profile, port: newValue }
        : profile
    );

    store.set(settingAtomFamily('connectionProfiles'), updatedProfiles);
  },
};

// App
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
export const LIST_ITEM_PRESS_DELAY_MS = 100;
export const LONG_PRESS_DELAY_MS = 250;
export const PLAYER_STATE_POLLING_INTERVAL_MS = 10000; // 10 seconds
