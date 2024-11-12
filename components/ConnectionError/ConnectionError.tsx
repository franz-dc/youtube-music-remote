import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';

import InfoView from '../InfoView';

export type ConnectionErrorProps = {
  type: 'noConnection' | 'serverError';
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
};

const errorTexts = {
  noConnection: {
    title: 'cantConnectToServer',
    message: 'noConnectionMessage',
  },
  serverError: {
    title: 'somethingWentWrong',
    message: 'serverError',
  },
} as const;

const ConnectionError = ({ type, onRetry, style }: ConnectionErrorProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });

  return (
    <InfoView
      title={t(errorTexts[type].title)}
      message={t(errorTexts[type].message)}
      icon='cellphone-link-off'
      onActionPress={onRetry}
      actionLabel={t('retry')}
      style={style}
    />
  );
};

export default ConnectionError;
