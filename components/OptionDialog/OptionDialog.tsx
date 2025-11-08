import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
  DialogProps,
  Portal,
  RadioButton,
} from 'react-native-paper';

import { SettingsSchema } from '@/schemas';

const styles = StyleSheet.create({
  dialogContent: {
    paddingHorizontal: 0,
    paddingBottom: 8,
  },
  label: {
    marginLeft: 8,
    textAlign: 'left',
  },
});

type StringOrNumberOnly<T> = {
  [K in keyof T]: string | number;
};

export type SelectDialogProps<
  K extends keyof StringOrNumberOnly<SettingsSchema>,
> = Omit<DialogProps, 'children'> & {
  /**
   * The label of the text input.
   * Also used as the dialog title.
   */
  label: string;
  /**
   * The initial value of the text input.
   */
  value: SettingsSchema[K];
  /**
   * Options to display.
   */
  options: {
    id: StringOrNumberOnly<SettingsSchema>[K];
    label: string;
  }[];
  /**
   * Function to call when the dialog is submitted.
   *
   * @param value The value of the text input.
   */
  onSubmit: (value: SettingsSchema[K]) => void | Promise<void>;
};

const OptionDialog = <K extends keyof SettingsSchema>({
  label,
  value: initialValue,
  options,
  onSubmit,
  onDismiss,
  ...DialogProps
}: SelectDialogProps<K>) => {
  const { t } = useTranslation('translation');

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleCancel = () => {
    setValue(initialValue);
    onDismiss?.();
  };

  const handleSelect = async (newValue: SettingsSchema[K]) => {
    setValue(newValue);
    onSubmit(newValue); // do not await to prevent lag
    onDismiss?.();
  };

  return (
    <Portal>
      <Dialog {...DialogProps} onDismiss={handleCancel}>
        <Dialog.Title>{label}</Dialog.Title>
        <Dialog.Content style={styles.dialogContent}>
          {/* @ts-ignore: number works in practice */}
          <RadioButton.Group value={value} onValueChange={handleSelect}>
            {options.map(({ id, label }) => (
              <RadioButton.Item
                key={id}
                label={label}
                // @ts-ignore: number works in practice
                value={id}
                position='leading'
                labelStyle={styles.label}
              />
            ))}
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>{t('common.cancel')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default OptionDialog;
