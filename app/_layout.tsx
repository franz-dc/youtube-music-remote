import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  MD3DarkTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';

import 'react-native-reanimated';
import 'intl-pluralrules';
import '@/i18n';
import { SettingsProvider } from '@/contexts';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => (
  <SettingsProvider>
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={DefaultTheme}>
        <StatusBar style='light' />
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  </SettingsProvider>
);

export default RootLayout;
