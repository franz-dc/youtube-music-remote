import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { List } from 'react-native-paper';

import {
  OptionDialog,
  SettingsListItem,
  SettingsSubheader,
  TextDialog,
} from '@/components';
import { settingAtomFamily, store, useSettingAtom } from '@/configs';
import { OPTION_SETTINGS, TEXT_SETTINGS } from '@/constants';
import { SettingsSchema } from '@/schemas';

const Settings = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  const [settingKey, setSettingKey] = useState<keyof SettingsSchema | null>(
    null
  );
  const [isTextDialogVisible, setIsTextDialogVisible] = useState(false);
  const [isOptionDialogVisible, setIsOptionDialogVisible] = useState(false);

  const [ipAddress] = useSettingAtom('ipAddress');
  const [theme] = useSettingAtom('theme');
  const [language] = useSettingAtom('language');

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
    <>
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
          type='option'
          onPress={openOptionDialog}
        />
        {Platform.OS === 'android' && (
          <SettingsListItem
            category='appearance'
            setting='useMaterialYouColors'
            type='switch'
            description={t('appearance.useMaterialYouColorsDescription')}
          />
        )}
        <SettingsListItem
          category='appearance'
          setting='showAlbumArtColor'
          type='switch'
          description={t('appearance.showAlbumArtColorDescription')}
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
          type='option'
          onPress={openOptionDialog}
        />
        {Platform.OS !== 'web' && (
          <SettingsListItem
            category='general'
            setting='keepScreenOn'
            type='switch'
          />
        )}
        {Platform.OS !== 'web' && (
          <SettingsListItem
            category='general'
            setting='checkForUpdatesOnAppStart'
            type='switch'
          />
        )}
      </List.Section>
      <TextDialog
        visible={!!textSetting && isTextDialogVisible}
        onDismiss={closeTextDialog}
        label={textSetting ? t(`${textSetting.category}.${settingKey}`) : ''}
        value={
          settingKey ? (store.get(settingAtomFamily(settingKey)) as string) : ''
        }
        required={textSetting ? textSetting.required : false}
        validation={textSetting ? textSetting.validation : undefined}
        numeric={textSetting ? textSetting.numeric : false}
        onSubmit={(value) => {
          if (!settingKey) return;
          store.set(settingAtomFamily(settingKey), value);
        }}
      />
      <OptionDialog
        visible={!!optionSetting && isOptionDialogVisible}
        onDismiss={closeOptionDialog}
        label={
          optionSetting ? t(`${optionSetting.category}.${settingKey}`) : ''
        }
        value={
          settingKey ? (store.get(settingAtomFamily(settingKey)) as string) : ''
        }
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
          store.set(settingAtomFamily(settingKey), value);
        }}
      />
    </>
  );
};

export default Settings;
