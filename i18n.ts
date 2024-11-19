import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGES } from './constants';
import { en, ja } from './locales';

i18n
  .use({
    type: 'languageDetector',
    detect: () => getLocales()[0].languageCode?.split('_')[0],
  })
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: LANGUAGES,
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
