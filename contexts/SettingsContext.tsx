import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import { DEFAULT_SETTINGS, SETTINGS_KEYS, SETTINGS_OPTIONS } from '@/constants';
import { SettingsSchema } from '@/schemas';

export const SettingsContext = createContext<{
  settings: SettingsSchema | null;
  setSetting: (key: keyof SettingsSchema, value: string | boolean) => void;
}>({
  settings: null,
  setSetting: () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation('translation');

  const [settings, setSettings] = useState<SettingsSchema | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
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

      setSettings({
        // connection
        host: parseText('host'),
        port: parseText('port'),
        // appearance
        theme: parseOption('theme'),
        showAlbumArtColor: parseBoolean('showAlbumArtColor'),
        showLikeAndDislikeButtons: parseBoolean('showLikeAndDislikeButtons'),
        showVolumeControl: parseBoolean('showVolumeControl'),
        showFullScreenButton: parseBoolean('showFullScreenButton'),
        // general
        language: parseOption('language'),
      });
    };

    fetchSettings();
  }, [i18n.language]);

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
