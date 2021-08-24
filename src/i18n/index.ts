import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import enTrans from './locales/en.json'
import zhTrans from './locales/zh.json'

i18n
  .use(LanguageDetector)

  .use(initReactI18next)

  .init({
    resources: {
      en: {
        translation: enTrans
      },
      zh: {
        translation: zhTrans
      }
    },
    preload: ['en'],
    fallbackLng: { zh: ['zh'], default: ['en'] },
    debug: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
