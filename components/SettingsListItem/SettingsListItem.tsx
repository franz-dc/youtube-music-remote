import { StyleSheet } from 'react-native';
import { List, ListItemProps, Switch } from 'react-native-paper';

import { useDelay } from '@/hooks';

const styles = StyleSheet.create({
  listItem: {
    paddingRight: 16,
  },
  description: {
    opacity: 0.75,
  },
});

export type SettingsListItemProps = ListItemProps & {
  type: 'switch' | 'text';
  value: string | boolean;
  onPress?: (value: any) => void | Promise<void>;
};

const SettingsListItem = ({
  type,
  value,
  description,
  onPress,
  ...rest
}: SettingsListItemProps) => {
  // https://stackoverflow.com/questions/63181142
  // This is so dumb, but it works.
  // Why does React Native have such a weird bug in the first place?
  const shouldRenderSwitch = useDelay(10);

  return (
    <List.Item
      {...rest}
      description={description || (type !== 'switch' ? value : undefined)}
      right={() =>
        type === 'switch' && shouldRenderSwitch ? (
          <Switch
            value={value as boolean}
            onValueChange={() => onPress?.(value)}
          />
        ) : undefined
      }
      onPress={() => onPress?.(value)}
      style={styles.listItem}
      descriptionStyle={styles.description}
    />
  );
};

export default SettingsListItem;
