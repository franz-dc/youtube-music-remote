import { Slot } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { goBack } from '@/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Settings = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  const { bottom: bottomInset } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title={t('title')} />
      </Appbar.Header>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: bottomInset }}
      >
        <Slot />
      </ScrollView>
    </View>
  );
};

export default Settings;
