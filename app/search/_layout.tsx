import { Slot, router } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar } from 'react-native-paper';

import { Searchbar } from '@/components';
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
  const submitQuery = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.replace(`/search?q=${trimmedQuery}`);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Searchbar onSubmit={submitQuery} />
      </Appbar.Header>
      <Slot />
    </GestureHandlerRootView>
  );
};
export default Layout;
