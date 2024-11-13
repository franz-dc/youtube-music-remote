import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { List, ListItemProps, Switch } from 'react-native-paper';

import { useSettingAtom } from '@/configs';
import { SettingsSchema } from '@/schemas';

const styles = StyleSheet.create({
  listItem: {
    paddingRight: 16,
  },
  description: {
    opacity: 0.75,
  },
});

export type SettingsListItemProps = Omit<ListItemProps, 'title' | 'onPress'> & {
  category: string;
  setting: keyof SettingsSchema;
  type: 'switch' | 'text' | 'option';
  title?: string;
  onPress?: (setting: keyof SettingsSchema) => void | Promise<void>;
  valueI18nPrefix?: string;
};

const SettingsListItem = ({
  category,
  setting,
  type,
  description,
  title,
  onPress,
  valueI18nPrefix,
  ...rest
}: SettingsListItemProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  const [value, setValue] = useSettingAtom(setting);

  const i18nValue = valueI18nPrefix
    ? t(`${valueI18nPrefix}.${value}`)
    : undefined;

  return (
    <List.Item
      {...rest}
      title={title || t(`${category}.${setting}`)}
      description={
        description || i18nValue || (type !== 'switch' ? value : undefined)
      }
      right={() =>
        type === 'switch' ? (
          <Switch value={value as boolean} onValueChange={setValue} />
        ) : undefined
      }
      onPress={() =>
        type === 'switch' ? setValue((prev) => !prev) : onPress?.(setting)
      }
      style={styles.listItem}
      descriptionStyle={styles.description}
    />
  );
};

export default SettingsListItem;
