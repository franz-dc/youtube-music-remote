import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { DEFAULT_SETTINGS, SETTINGS_KEYS, SETTINGS_OPTIONS } from '@/constants';
import { SettingsSchema } from '@/schemas';

const systemLanguage = RNLanguageDetector.detect() as string;

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

      const parseOption = (key: keyof typeof SETTINGS_OPTIONS) =>
        savedSettings[key] && SETTINGS_OPTIONS[key].includes(savedSettings[key])
          ? (savedSettings[key] as string)
          : (DEFAULT_SETTINGS[key] as string);

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
      {children}
    </SettingsContext.Provider>
  );
};
