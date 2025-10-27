// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./en.json";
import esTranslation from "./es.json";

// Las traducciones
const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
};

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languagedetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: "es", // Idioma de respaldo si el idioma detectado no está disponible
    debug: true, // Poner a false en producción
    interpolation: {
      escapeValue: false, // no necesitamos escapar react xss
    },
    detection: {
      order: [
        "localStorage",
        "navigator",
        "querystring",
        "cookie",
        "sessionStorage",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage"], // Cachear el idioma detectado en localStorage
    },
  });

export default i18n;
