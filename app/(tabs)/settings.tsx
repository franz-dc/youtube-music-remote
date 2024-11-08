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
  const [isTextDialogVisible, setIsTextDialogVisible] = useState(false);
  // const [isSelectDialogVisible, setIsSelectDialogVisible] = useState(false);

  const { settings, setSetting } = useSettings();

  if (!settings) return <LoadingView />;

  const { ipAddress, theme, language } = settings;

  const openTextDialog = (setting: keyof SettingsSchema) => {
    setSelectedSetting(setting);
    setSelectedSettingValue(settings[setting] as string);
    setIsTextDialogVisible(true);
  };

  const closeTextDialog = () => setIsTextDialogVisible(false);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={t('title')} />
      </Appbar.Header>
      <ScrollView>
        <List.Section>
          <SettingsSubheader>{t('connection.title')}</SettingsSubheader>
          <SettingsListItem
            category='connection'
            setting='ipAddress'
            description={ipAddress || '-'}
            type='text'
            onPress={() => openTextDialog('ipAddress')}
          />
          <SettingsListItem
            category='connection'
            setting='port'
            type='text'
            onPress={() => openTextDialog('port')}
          />
        </List.Section>
        <List.Section>
          <SettingsSubheader>{t('appearance.title')}</SettingsSubheader>
          <SettingsListItem
            category='appearance'
            setting='theme'
            description={t(`appearance.themes.${theme}`)}
            type='select'
            onPress={() => {}}
          />
          <SettingsListItem
            category='appearance'
            setting='showAlbumArtColor'
            type='switch'
          />
          <SettingsListItem
            category='appearance'
            setting='showLikeAndDislikeButtons'
            type='switch'
          />
          <SettingsListItem
            category='appearance'
            setting='showVolumeControl'
            type='switch'
          />
          <SettingsListItem
            category='appearance'
            setting='showFullScreenButton'
            type='switch'
          />
        </List.Section>
        <List.Section>
          <SettingsSubheader>{t('general.title')}</SettingsSubheader>
          <SettingsListItem
            category='general'
            setting='language'
            description={t(`general.languages.${language}`)}
            type='select'
            onPress={() => {}}
          />
        </List.Section>
      </ScrollView>
      {selectedSetting && (
        <TextDialog
          visible={isTextDialogVisible}
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
