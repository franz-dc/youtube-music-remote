import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';

import 'react-native-reanimated';
import 'intl-pluralrules';
import '@/i18n';
import { SettingsProvider } from '@/contexts';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => (
  <SettingsProvider>
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  </SettingsProvider>
);

export default RootLayout;
