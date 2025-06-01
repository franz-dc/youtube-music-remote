import { useState } from 'react';

import { Href, Slot, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar, Menu } from 'react-native-paper';

import { MORE_ICON } from '@/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Layout = () => {
  const { t } = useTranslation('translation');

  // menu
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const pushFromMenu = (path: Href<string>) => {
    closeMenu();
    router.push(path);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={t('queue.title')} />
        <Appbar.Action icon='magnify' onPress={() => pushFromMenu('/search')} />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}
          anchorPosition='bottom'
        >
          <Menu.Item
            title={t('settings.title')}
            leadingIcon='cog'
            onPress={() => pushFromMenu('/settings')}
          />
          <Menu.Item
            title={t('about.title')}
            leadingIcon='information-outline'
            onPress={() => pushFromMenu('/about')}
          />
        </Menu>
      </Appbar.Header>
      <Slot />
    </GestureHandlerRootView>
  );
};

export default Layout;
