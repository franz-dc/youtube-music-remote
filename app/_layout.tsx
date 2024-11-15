import { useEffect, useMemo, useState } from 'react';

import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as JotaiProvider } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Appearance, View } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

import 'react-native-reanimated';
import 'intl-pluralrules';
import '@/i18n';

import { store, useSettingAtom } from '@/configs';
import { SETTINGS_OPTIONS } from '@/constants';

const systemColorScheme = Appearance.getColorScheme() || 'dark';

SplashScreen.preventAutoHideAsync();

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
    SplashScreen.preventAutoHideAsync();

    const initConfig = async () => {
      i18n.changeLanguage(
        language === 'system' ? systemLanguage : (language as string)
      );

      await NavigationBar.setPositionAsync('absolute');
      await NavigationBar.setBackgroundColorAsync('transparent');

      setIsInitialized(true);
      await SplashScreen.hideAsync();
    };

    initConfig();
  }, [i18n, language, systemLanguage]);

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

  if (!isInitialized) return null;

  return (
    <PaperProvider theme={activeTheme}>
      <StatusBar style={activeTheme ? 'light' : 'dark'} />
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
