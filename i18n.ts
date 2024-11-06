import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';

import { en, ja } from './locales';

if (Platform.OS !== 'web') {
  i18n.use(RNLanguageDetector);
}

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'ja'],
  resources: {
    en: {
      translation: en,
    },
    ja: {
      translation: ja,
    },
  },
});

export default i18n;
