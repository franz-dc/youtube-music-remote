import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List, Switch } from 'react-native-paper';

import { SettingsListItem, SettingsSubheader } from '@/components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Settings = () => {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'settings' });

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={t('title')} />
      </Appbar.Header>
      <ScrollView>
        <List.Section>
          <SettingsSubheader>{t('connection.title')}</SettingsSubheader>
          <SettingsListItem
            title={t('connection.host')}
            description='-'
            onPress={() => {}}
          />
          <SettingsListItem
            title={t('connection.port')}
            description='-'
            onPress={() => {}}
          />
        </List.Section>
        <List.Section>
          <SettingsSubheader>{t('appearance.title')}</SettingsSubheader>
          <SettingsListItem
            title={t('appearance.theme')}
            description='-'
            onPress={() => {}}
          />
          <SettingsListItem
            title={t('appearance.showAlbumArtColor')}
            onPress={() => {}}
            right={() => <Switch />}
          />
        </List.Section>
        <List.Section>
          <SettingsSubheader>{t('general.title')}</SettingsSubheader>
          <SettingsListItem
            title={t('general.language')}
            description={t(`general.languages.${i18n.language}`)}
            onPress={() => {}}
          />
        </List.Section>
        <List.Section>
          <SettingsSubheader>{t('advanced.title')}</SettingsSubheader>
          <SettingsListItem
            title={t('advanced.pollingRate')}
            description='-'
            onPress={() => {}}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

export default Settings;
