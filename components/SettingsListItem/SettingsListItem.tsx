import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { List, ListItemProps, Switch } from 'react-native-paper';

import { useSettings } from '@/hooks';
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
  // value: string | boolean;
  title?: string;
  onPress?: (setting: keyof SettingsSchema) => void | Promise<void>;
};

const SettingsListItem = ({
  category,
  setting,
  type,
  // value,
  description,
  title,
  onPress,
  ...rest
}: SettingsListItemProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  const { settings, setSetting } = useSettings();

  const value = settings[setting];

  return (
    <List.Item
      {...rest}
      title={title || t(`${category}.${setting}`)}
      description={description || (type !== 'switch' ? value : undefined)}
      right={() =>
        type === 'switch' ? (
          <Switch
            value={value as boolean}
            onValueChange={() => setSetting(setting, !value)}
          />
        ) : undefined
      }
      onPress={() =>
        type === 'switch' ? setSetting(setting, !value) : onPress?.(setting)
      }
      style={styles.listItem}
      descriptionStyle={styles.description}
    />
  );
};

export default SettingsListItem;
