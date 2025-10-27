import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { List, ListItemProps } from 'react-native-paper';

import { useSettingAtom } from '@/configs';
import { LIST_ITEM_PRESS_DELAY_MS } from '@/constants';
import { SettingsSchema } from '@/schemas';

import Switch from '../Switch';

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
          <View>
            <Switch
              selected={value as boolean}
              onPress={() => setValue((prev) => !prev)}
            />
          </View>
        ) : undefined
      }
      onPress={() =>
        type === 'switch' ? setValue((prev) => !prev) : onPress?.(setting)
      }
      style={styles.listItem}
      descriptionStyle={styles.description}
      unstable_pressDelay={LIST_ITEM_PRESS_DELAY_MS}
    />
  );
};

export default SettingsListItem;
