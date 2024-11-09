import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
  DialogProps,
  HelperText,
  Portal,
  TextInput,
} from 'react-native-paper';

const styles = StyleSheet.create({
  dialogContent: {
    paddingBottom: 16,
  },
});

export type TextDialogProps = Omit<DialogProps, 'children'> & {
  /**
   * The label of the text input.
   * Also used as the dialog title.
   */
  label: string;
  /**
   * The initial value of the text input.
   */
  value: string;
  /**
   * Helper text to display below the text input.
   */
  helperText?: string;
  /**
   * Whether the text input is required.
   */
  required?: boolean;
  /**
   * Whether the text input should only accept numeric values.
   */
  numeric?: boolean;
  /**
   * Validation function for the text input.
   *
   * @param value The value of the text input to validate.
   * @returns `null` if the input is valid or an i18n key for the error message
   * if the input is invalid.
   */
  validation?: (value: string) => string | null;
  /**
   * Function to call when the dialog is submitted.
   *
   * @param value The value of the text input.
   */
  onSubmit: (value: string) => void | Promise<void>;
};

const TextDialog = ({
  label,
  value: initialValue,
  required,
  numeric,
  helperText,
  validation,
  onSubmit,
  onDismiss,
  ...DialogProps
}: TextDialogProps) => {
  const { t } = useTranslation('translation');

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const error = required && !value ? 'common.required' : validation?.(value);

  const handleCancel = () => {
    setValue(initialValue);
    onDismiss?.();
  };

  const handleOk = async () => {
    await onSubmit(value);
    onDismiss?.();
  };

  return (
    <Portal>
      <Dialog {...DialogProps} onDismiss={handleCancel}>
        <Dialog.Title>{label}</Dialog.Title>
        <Dialog.Content style={styles.dialogContent}>
          <TextInput
            value={value}
            onChangeText={setValue}
            error={!!error}
            autoFocus
            inputMode={numeric ? 'numeric' : 'text'}
            onSubmitEditing={handleOk}
          />
          {(error || helperText) && (
            <HelperText type={error ? 'error' : 'info'}>
              {typeof error === 'string' ? t(error) : helperText}
            </HelperText>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>{t('common.cancel')}</Button>
          <Button onPress={handleOk} disabled={!!error}>
            {t('common.ok')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default TextDialog;
