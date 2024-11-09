import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List } from 'react-native-paper';

import {
  LoadingView,
  OptionDialog,
  SettingsListItem,
  SettingsSubheader,
  TextDialog,
} from '@/components';
import { OPTION_SETTINGS, TEXT_SETTINGS } from '@/constants';
import { useSettings } from '@/hooks';
import { SettingsSchema } from '@/schemas';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Settings = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  const [settingKey, setSettingKey] = useState<keyof SettingsSchema | null>(
    null
  );
  const [isTextDialogVisible, setIsTextDialogVisible] = useState(false);
  const [isOptionDialogVisible, setIsOptionDialogVisible] = useState(false);

  const { settings, setSetting } = useSettings();

  if (!settings) return <LoadingView />;

  const { ipAddress, theme, language } = settings;

  const textSetting =
    !!settingKey && !!TEXT_SETTINGS[settingKey]
      ? TEXT_SETTINGS[settingKey]
      : null;

  const optionSetting =
    !!settingKey && !!OPTION_SETTINGS[settingKey]
      ? OPTION_SETTINGS[settingKey]
      : null;

  const openTextDialog = (setting: keyof SettingsSchema) => {
    setSettingKey(setting);
    setIsTextDialogVisible(true);
  };

  const closeTextDialog = () => setIsTextDialogVisible(false);

  const openOptionDialog = (setting: keyof SettingsSchema) => {
    setSettingKey(setting);
    setIsOptionDialogVisible(true);
  };

  const closeOptionDialog = () => setIsOptionDialogVisible(false);

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
            onPress={openTextDialog}
          />
          <SettingsListItem
            category='connection'
            setting='port'
            type='text'
            onPress={openTextDialog}
          />
        </List.Section>
        <List.Section>
          <SettingsSubheader>{t('appearance.title')}</SettingsSubheader>
          <SettingsListItem
            category='appearance'
            setting='theme'
            description={t(`appearance.themes.${theme}`)}
            type='select'
            onPress={openOptionDialog}
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
            onPress={openOptionDialog}
          />
        </List.Section>
      </ScrollView>
      <TextDialog
        visible={!!textSetting && isTextDialogVisible}
        onDismiss={closeTextDialog}
        label={textSetting ? t(`${textSetting.category}.${settingKey}`) : ''}
        value={settingKey ? (settings[settingKey] as string) : ''}
        required={textSetting ? textSetting.required : false}
        validation={textSetting ? textSetting.validation : undefined}
        numeric={textSetting ? textSetting.numeric : false}
        onSubmit={(value) => {
          if (!settingKey) return;
          setSetting(settingKey, value);
        }}
      />
      <OptionDialog
        visible={!!optionSetting && isOptionDialogVisible}
        onDismiss={closeOptionDialog}
        label={
          optionSetting ? t(`${optionSetting.category}.${settingKey}`) : ''
        }
        value={settingKey ? (settings[settingKey] as string) : ''}
        options={
          optionSetting
            ? optionSetting.options.map((option) => ({
                id: option,
                label: t(
                  `${optionSetting.category}.${
                    optionSetting.optionI18nPrefix
                  }.${option}`
                ),
              }))
            : []
        }
        onSubmit={(value) => {
          if (!settingKey) return;
          setSetting(settingKey, value);
        }}
      />
    </View>
  );
};

export default Settings;
