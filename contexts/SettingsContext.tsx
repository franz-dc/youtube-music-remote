import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Appearance } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

import { DEFAULT_SETTINGS, SETTINGS_KEYS, SETTINGS_OPTIONS } from '@/constants';
import { SettingsSchema } from '@/schemas';

const systemLanguage = RNLanguageDetector.detect() as string;
const systemColorScheme = Appearance.getColorScheme() || 'dark';

export const SettingsContext = createContext<{
  settings: SettingsSchema;
  setSetting: (key: keyof SettingsSchema, value: string | boolean) => void;
}>({
  settings: DEFAULT_SETTINGS,
  setSetting: () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation('translation');

  const [settings, setSettings] = useState<SettingsSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { theme: systemDynamicTheme } = useMaterial3Theme();

  const baseThemes: Record<
    Exclude<(typeof SETTINGS_OPTIONS)['theme'][number], 'system'>,
    ThemeProp
  > = {
    light: {
      ...MD3LightTheme,
      colors: settings?.useMaterialYouColors
        ? systemDynamicTheme.light
        : MD3LightTheme.colors,
    },
    dark: {
      ...MD3DarkTheme,
      colors: settings?.useMaterialYouColors
        ? systemDynamicTheme.dark
        : MD3DarkTheme.colors,
    },
    black: {
      ...MD3DarkTheme,
      colors: {
        ...(settings?.useMaterialYouColors
          ? systemDynamicTheme.dark
          : MD3DarkTheme.colors),
        background: '#000000',
        surface: '#000000',
        backdrop: '#00000066', // 40% opacity
      },
    },
  };

  const themes = {
    ...baseThemes,
    system: systemColorScheme === 'dark' ? baseThemes.dark : baseThemes.light,
  };

  useEffect(() => {
    if (!isLoading) return;

    const fetchSettings = async () => {
      await SplashScreen.preventAutoHideAsync();

      const savedSettingsRes = await Promise.all(
        SETTINGS_KEYS.map((key) => AsyncStorage.getItem(key))
      );

      const savedSettings = SETTINGS_KEYS.reduce(
        (acc, key, index) => ({
          ...acc,
          [key]: savedSettingsRes[index],
        }),
        {} as Record<keyof SettingsSchema, string | null>
      );

      const parseBoolean = (key: keyof SettingsSchema) =>
        savedSettings[key] !== null
          ? savedSettings[key] === 'true'
          : (DEFAULT_SETTINGS[key] as boolean);

      const parseOption = <K extends keyof typeof SETTINGS_OPTIONS>(key: K) =>
        (savedSettings[key] &&
        (SETTINGS_OPTIONS[key] as string[]).includes(
          savedSettings[key] as string
        )
          ? (savedSettings[key] as string)
          : (DEFAULT_SETTINGS[
              key
            ] as string)) as (typeof SETTINGS_OPTIONS)[K][number];

      const parseText = (key: keyof SettingsSchema) =>
        savedSettings[key] !== null
          ? (savedSettings[key] as string)
          : (DEFAULT_SETTINGS[key] as string);

      const parsedSettings: SettingsSchema = {
        // connection
        ipAddress: parseText('ipAddress'),
        port: parseText('port'),
        // appearance
        theme: parseOption('theme'),
        useMaterialYouColors: parseBoolean('useMaterialYouColors'),
        showAlbumArtColor: parseBoolean('showAlbumArtColor'),
        showLikeAndDislikeButtons: parseBoolean('showLikeAndDislikeButtons'),
        showVolumeControl: parseBoolean('showVolumeControl'),
        showFullScreenButton: parseBoolean('showFullScreenButton'),
        // general
        language: parseOption('language'),
      };

      setSettings(parsedSettings);

      i18n.changeLanguage(
        parsedSettings.language === 'system'
          ? systemLanguage
          : parsedSettings.language
      );

      setIsLoading(false);

      await SplashScreen.hideAsync();
    };

    fetchSettings();
  }, [isLoading, i18n]);

  // update i18n language when language setting changes
  useEffect(() => {
    if (!settings) return;
    i18n.changeLanguage(
      settings.language === 'system' ? systemLanguage : settings.language
    );
  }, [settings, i18n]);

  // set setting optimistically, revert if failed
  const setSetting = (key: keyof SettingsSchema, value: string | boolean) => {
    if (!settings) return;
    const currentSetting = settings[key];
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
    AsyncStorage.setItem(key, value.toString()).catch(() => {
      setSettings((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [key]: currentSetting,
        };
      });
    });
  };

  if (!settings || isLoading) return null;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSetting,
      }}
    >
      <PaperProvider theme={themes[settings.theme] || themes.system}>
        <StatusBar style={themes[settings.theme].dark ? 'light' : 'dark'} />
        {children}
      </PaperProvider>
    </SettingsContext.Provider>
  );
};
