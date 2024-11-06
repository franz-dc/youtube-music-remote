import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

const styles = StyleSheet.create({
  scrollView: {
    // @ts-ignore: ScrollView does not render a scrollbar on web
    height: Platform.OS === 'web' ? 'calc(100vh - 144px)' : 'auto',
  },
});

const Settings = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={t('title')} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <Text>UNDER CONSTRUCTION</Text>
      </ScrollView>
    </View>
  );
};

export default Settings;
