import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

import {
  LoadingView,
  SettingsListItem,
  SettingsSubheader,
  TextDialog,
} from '@/components';
import { TEXT_SETTINGS } from '@/constants';
import { useSettings } from '@/hooks';
import { SettingsSchema } from '@/schemas';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Settings = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  const [selectedSetting, setSelectedSetting] = useState<
    keyof SettingsSchema | null
  >(null);
  const [selectedSettingValue, setSelectedSettingValue] = useState<string>('');

  // Text settings
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const { settings, setSetting } = useSettings();

  if (!settings) return <LoadingView />;

  const {
    // connection
    ipAddress,
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

  const openTextDialog = (setting: keyof SettingsSchema) => {
    setSelectedSetting(setting);
    setSelectedSettingValue(settings[setting] as string);
    setIsDialogVisible(true);
  };

  const closeTextDialog = () => setIsDialogVisible(false);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={t('title')} />
      </Appbar.Header>
      <ScrollView>
        <List.Section>
          <SettingsSubheader>{t('connection.title')}</SettingsSubheader>
          <SettingsListItem
            title={t('connection.ipAddress')}
            value={ipAddress}
            description={ipAddress || '-'}
            type='text'
            onPress={() => openTextDialog('ipAddress')}
          />
          <SettingsListItem
            title={t('connection.port')}
            value={port}
            type='text'
            onPress={() => openTextDialog('port')}
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
      {selectedSetting && (
        <TextDialog
          visible={isDialogVisible}
          onDismiss={closeTextDialog}
          label={t(
            `${TEXT_SETTINGS[selectedSetting].category}.${selectedSetting}`
          )}
          value={selectedSettingValue}
          required={TEXT_SETTINGS[selectedSetting].required}
          validation={TEXT_SETTINGS[selectedSetting].validation}
          numeric={TEXT_SETTINGS[selectedSetting].numeric}
          onSubmit={(value) => {
            setSetting(selectedSetting as keyof SettingsSchema, value);
          }}
        />
      )}
    </View>
  );
};

export default Settings;
