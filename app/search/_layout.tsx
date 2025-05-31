import { useState } from 'react';

import { Slot, router, useGlobalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar, IconButton, useTheme } from 'react-native-paper';

import { goBack } from '@/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbarContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 16,
    paddingVertical: 6,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 9999,
  },
  textInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'web' ? 6 : 0,
  },
  clearButton: {
    margin: -6,
  },
});

const Layout = () => {
  const theme = useTheme();
  const { t } = useTranslation('translation', { keyPrefix: 'search' });

  const { q } = useGlobalSearchParams<{ q: string }>();

  const [query, setQuery] = useState(q || '');

  const clearQuery = () => setQuery('');

  const submitQuery = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.replace(`/search?q=${trimmedQuery}`);
    }
  };

  const hasQuery = query.trim().length !== 0;

  return (
    <GestureHandlerRootView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <View
          style={[
            styles.searchbarContainer,
            { backgroundColor: theme.colors.surfaceDisabled },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: theme.colors.onSurface },
              Platform.OS === 'web' && {
                // @ts-expect-error: remove outline for web
                outline: 'none',
              },
            ]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            cursorColor={theme.colors.primary}
            returnKeyType='search'
            autoCapitalize='none'
            autoFocus={!q}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submitQuery}
            blurOnSubmit={query.trim().length !== 0}
          />
          {hasQuery && (
            <IconButton
              icon='close'
              onPress={clearQuery}
              style={styles.clearButton}
            />
          )}
        </View>
      </Appbar.Header>
      <Slot />
    </GestureHandlerRootView>
  );
};
export default Layout;
