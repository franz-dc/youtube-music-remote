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

export type SelectDialogProps = Omit<DialogProps, 'children'> & {
  /**
   * The label of the text input.
   * Also used as the dialog title.
   */
  label: string;
  /**
   * The initial value of the text input.
   */
  value: string | number;
  /**
   * Options to display.
   */
  options: {
    id: string | number;
    label: string;
  }[];
  /**
   * Function to call when the dialog is submitted.
   *
   * @param value The value of the text input.
   */
  onSubmit: (value: string) => void | Promise<void>;
};

const OptionDialog = ({
  label,
  value: initialValue,
  options,
  onSubmit,
  onDismiss,
  ...DialogProps
}: SelectDialogProps) => {
  const { t } = useTranslation('translation');

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleCancel = () => {
    setValue(initialValue);
    onDismiss?.();
  };

  const handleSelect = async (newValue: string) => {
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
