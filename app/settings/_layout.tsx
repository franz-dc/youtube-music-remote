import { Slot, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Settings = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={t('title')} />
      </Appbar.Header>
      <Slot />
    </View>
  );
};

export default Settings;
