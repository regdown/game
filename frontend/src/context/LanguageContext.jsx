import React, { createContext, useState, useContext } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Default to English, check local storage
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

    const toggleLanguage = () => {
        const newLang = lang === 'en' ? 'ru' : 'en';
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    const t = (key) => {
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
