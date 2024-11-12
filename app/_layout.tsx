import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

import 'react-native-reanimated';
import 'intl-pluralrules';
import '@/i18n';

import { SettingsProvider } from '@/contexts';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const StackWithTheme = () => {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
        animation: 'simple_push',
      }}
    />
  );
};

const RootLayout = () => (
  <SettingsProvider>
    <QueryClientProvider client={queryClient}>
      <StackWithTheme />
    </QueryClientProvider>
  </SettingsProvider>
);

export default RootLayout;
