import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

import { LoadingView, SettingsListItem, SettingsSubheader } from '@/components';
import { useSettings } from '@/hooks';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Settings = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  const { settings, setSetting } = useSettings();

  if (!settings) return <LoadingView />;

  const {
    // connection
    host,
    port,
    // appearance
    theme,
    showAlbumArtColor,
    showLikeAndDislikeButtons,
    showVolumeControl,
    showFullScreenButton,
    // general
    language,
  } = settings;

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
            value={host}
            description={host || '-'}
            type='text'
            onPress={() => {}}
          />
          <SettingsListItem
            title={t('connection.port')}
            value={port}
            type='text'
            onPress={() => {}}
          />
        </List.Section>
        <List.Section>
          <SettingsSubheader>{t('appearance.title')}</SettingsSubheader>
          <SettingsListItem
            title={t('appearance.theme')}
            value={theme}
            description={t(`appearance.themes.${theme}`)}
            type='text'
            onPress={() => {}}
          />
          <SettingsListItem
            title={t('appearance.showAlbumArtColor')}
            value={showAlbumArtColor}
            type='switch'
            onPress={(v) => setSetting('showAlbumArtColor', !v)}
          />
          <SettingsListItem
            title={t('appearance.showLikeAndDislikeButtons')}
            value={showLikeAndDislikeButtons}
            type='switch'
            onPress={(v) => setSetting('showLikeAndDislikeButtons', !v)}
          />
          <SettingsListItem
            title={t('appearance.showVolumeControl')}
            value={showVolumeControl}
            type='switch'
            onPress={(v) => setSetting('showVolumeControl', !v)}
          />
          <SettingsListItem
            title={t('appearance.showFullScreenButton')}
            value={showFullScreenButton}
            type='switch'
            onPress={(v) => setSetting('showFullScreenButton', !v)}
          />
        </List.Section>
        <List.Section>
          <SettingsSubheader>{t('general.title')}</SettingsSubheader>
          <SettingsListItem
            title={t('general.language')}
            value={language}
            description={t(`general.languages.${language}`)}
            type='text'
            onPress={() => {}}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

export default Settings;
