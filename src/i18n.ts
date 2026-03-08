import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import ptTranslation from './locales/pt/translation.json';

const resources = {
    en: {
        translation: enTranslation
    },
    es: {
        translation: esTranslation
    },
    pt: {
        translation: ptTranslation
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        lng: 'en', // default language
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;
