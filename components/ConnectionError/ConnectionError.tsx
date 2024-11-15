import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';

import InfoView from '../InfoView';

const errorTexts = {
  noConnection: {
    title: 'cantConnectToServer',
    message: 'noConnectionMessage',
  },
  serverError: {
    title: 'somethingWentWrong',
    message: 'serverError',
  },
  notConfigured: {
    title: 'notConfigured',
    message: 'notConfiguredMessage',
  },
} as const;

export type ConnectionErrorProps = {
  type: keyof typeof errorTexts;
  onActionPress?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const ConnectionError = ({
  type,
  onActionPress,
  actionLabel,
  style,
}: ConnectionErrorProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });

  return (
    <InfoView
      title={t(errorTexts[type].title)}
      message={t(errorTexts[type].message)}
      icon='cellphone-link-off'
      onActionPress={onActionPress}
      actionLabel={actionLabel || t('retry')}
      style={style}
    />
  );
};

export default ConnectionError;
