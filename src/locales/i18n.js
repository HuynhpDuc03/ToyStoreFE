// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import vn from "./vn.json";

// Lấy ngôn ngữ từ localStorage hoặc đặt mặc định là "vn"
const savedLanguage = localStorage.getItem("language") || "vn";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vn: { translation: vn },
  },
  lng: savedLanguage, // Sử dụng ngôn ngữ đã lưu
  fallbackLng: "vn", 
  interpolation: {
    escapeValue: false, 
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
