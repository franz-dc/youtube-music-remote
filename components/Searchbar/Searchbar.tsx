import { useState } from 'react';

import { useGlobalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
} from 'react-native';
import { IconButton, TextInput, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
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
    height: 28,
    marginHorizontal: -14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  clearButton: {
    margin: -6,
  },
  outline: {
    display: 'none',
  },
});

export type SearchbarProps = TextInputProps & {
  onSubmit: (query: string) => void;
};

const Searchbar = ({ onSubmit, ...props }: SearchbarProps) => {
  const theme = useTheme();

  const { t } = useTranslation('translation', { keyPrefix: 'search' });

  const { q } = useGlobalSearchParams<{ q: string }>();
  const [query, setQuery] = useState(q || '');
  const hasQuery = query.trim().length !== 0;
  const clearQuery = () => setQuery('');

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (Platform.OS !== 'web') return;
    if (e.nativeEvent.key === 'Enter') {
      onSubmit(query);
    }
  };

  const handleSubmitEditing = () => {
    if (Platform.OS === 'web') return;
    onSubmit(query);
  };

  return (
    <View
      style={[
        styles.searchbarContainer,
        { backgroundColor: theme.colors.surfaceDisabled },
      ]}
    >
      <TextInput
        mode='outlined'
        outlineStyle={styles.outline}
        style={[
          styles.textInput,
          { color: theme.colors.onSurface },
          Platform.OS === 'web' && {
            // @ts-expect-error: remove outline for web
            outline: 'none',
          },
        ]}
        placeholder={t('searchPlaceholder')}
        returnKeyType='search'
        enterKeyHint='search'
        autoCapitalize='none'
        autoFocus={!q}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmitEditing}
        onKeyPress={handleKeyPress}
        blurOnSubmit={query.trim().length !== 0}
        {...props}
      />
      {hasQuery && (
        <IconButton
          icon='close'
          onPress={clearQuery}
          style={styles.clearButton}
        />
      )}
    </View>
  );
};

export default Searchbar;
