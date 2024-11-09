import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { List, ListItemProps, Switch } from 'react-native-paper';

import { useDelay, useSettings } from '@/hooks';
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

  // https://stackoverflow.com/questions/63181142
  // This is so dumb, but it works.
  // Why does React Native have such a weird bug in the first place?
  const shouldRenderSwitch = useDelay(10);

  const { settings, setSetting } = useSettings();

  const value = settings![setting];

  return (
    <List.Item
      {...rest}
      title={title || t(`${category}.${setting}`)}
      description={
        description || (type !== 'switch' ? settings![setting] : undefined)
      }
      right={() =>
        type === 'switch' && shouldRenderSwitch ? (
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
