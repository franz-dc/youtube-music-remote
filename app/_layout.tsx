import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  MD3DarkTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';

import 'react-native-reanimated';
import 'intl-pluralrules';
import '@/i18n';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <PaperProvider theme={DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  </QueryClientProvider>
);

export default RootLayout;
