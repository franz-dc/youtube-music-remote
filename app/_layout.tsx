import { useEffect, useMemo, useState } from 'react';

import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as NavigationBar from 'expo-navigation-bar';
import {
  requestPermissionsAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { SplashScreen, Stack } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { Provider as JotaiProvider } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Appearance, Platform, View } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';
import 'react-native-reanimated';
import 'intl-pluralrules';
import '@/i18n';

import { UpdateRedirect } from '@/components';
import { store, useSettingAtom } from '@/configs';
import { APP_FILE_EXTENSION, SETTINGS_OPTIONS } from '@/constants';
import { useStartupUpdateChecker } from '@/hooks';

const systemColorScheme = Appearance.getColorScheme() || 'dark';

SplashScreen.preventAutoHideAsync();

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const queryClient = new QueryClient();

const StackWithConfig = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const { i18n } = useTranslation('translation');
  const [systemLanguage] = useState(i18n.language);

  // initialize ip address and port for queue ui
  useSettingAtom('ipAddress');
  useSettingAtom('port');

  const [language] = useSettingAtom('language');
  const [theme] = useSettingAtom('theme');
  const [useMaterialYouColors] = useSettingAtom('useMaterialYouColors');
  const [keepScreenOn] = useSettingAtom('keepScreenOn');
  const [isFreshInstall, setIsFreshInstall] = useSettingAtom('isFreshInstall');

  const [isKeepScreenOnEnabledOnce, setIsKeepScreenOnEnabledOnce] =
    useState(false);

  const { theme: systemDynamicTheme } = useMaterial3Theme();

  const themes = useMemo<
    Record<(typeof SETTINGS_OPTIONS)['theme'][number], ThemeProp>
  >(() => {
    const baseThemes = {
      light: {
        ...MD3LightTheme,
        colors: useMaterialYouColors
          ? systemDynamicTheme.light
          : MD3LightTheme.colors,
      },
      dark: {
        ...MD3DarkTheme,
        colors: useMaterialYouColors
          ? systemDynamicTheme.dark
          : MD3DarkTheme.colors,
      },
      black: {
        ...MD3DarkTheme,
        colors: {
          ...(useMaterialYouColors
            ? systemDynamicTheme.dark
            : MD3DarkTheme.colors),
          background: '#000000',
          surface: '#000000',
          backdrop: '#00000066', // 40% opacity
        },
      },
    };

    return {
      ...baseThemes,
      system: systemColorScheme === 'dark' ? baseThemes.dark : baseThemes.light,
    };
  }, [useMaterialYouColors, systemDynamicTheme]);

  // initialize app with user settings
  useEffect(() => {
    if (isInitialized) return;

    const initConfig = async () => {
      i18n.changeLanguage(
        language === 'system' ? systemLanguage : (language as string)
      );

      await NavigationBar.setPositionAsync('absolute');
      await NavigationBar.setBackgroundColorAsync('transparent');

      setIsInitialized(true);
      await SplashScreen.hideAsync();

      if (Platform.OS !== 'web') {
        requestPermissionsAsync();
      }
    };

    initConfig();
  }, [isInitialized, i18n, language, systemLanguage, setIsFreshInstall]);

  // update i18n language when language setting changes
  useEffect(() => {
    i18n.changeLanguage(
      language === 'system' ? systemLanguage : (language as string)
    );
  }, [i18n, language, systemLanguage]);

  const activeTheme = useMemo(
    () => themes[theme as keyof typeof themes] || themes.system,
    [themes, theme]
  );

  // enable/disable KeepAwake when keepScreenOn setting changes
  useEffect(() => {
    const keepScreenOnHandler = async () => {
      if (keepScreenOn) {
        await activateKeepAwakeAsync();
        setIsKeepScreenOnEnabledOnce(true);
      } else {
        if (!isKeepScreenOnEnabledOnce) return;
        deactivateKeepAwake();
      }
    };

    keepScreenOnHandler();
  }, [keepScreenOn, isKeepScreenOnEnabledOnce]);

  // update status bar style when theme changes
  useEffect(() => {
    setStatusBarStyle(
      themes[theme as keyof typeof themes].dark ? 'light' : 'dark'
    );
  }, [theme, themes]);

  useStartupUpdateChecker(isInitialized);

  // clear download cache on fresh installs
  useEffect(() => {
    if (!isFreshInstall || Platform.OS === 'web' || isInitialized) return;

    FileSystem.deleteAsync(
      FileSystem.cacheDirectory + `update.${APP_FILE_EXTENSION}`,
      { idempotent: true }
    );

    setIsFreshInstall(false);
  }, [isFreshInstall, setIsFreshInstall, isInitialized]);

  if (!isInitialized) return null;

  return (
    <PaperProvider theme={activeTheme}>
      {Platform.OS !== 'web' && (
        <UpdateRedirect isInitialized={isInitialized} />
      )}
      <View
        style={{ flex: 1, backgroundColor: activeTheme.colors!.background }}
      >
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: activeTheme!.colors!.background,
            },
            headerShown: false,
            animation: 'simple_push',
          }}
        />
      </View>
    </PaperProvider>
  );
};

const RootLayout = () => (
  <JotaiProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <StackWithConfig />
    </QueryClientProvider>
  </JotaiProvider>
);

export default RootLayout;
