import React, { createContext, useContext, useState, useCallback } from 'react';
import { IntlProvider } from 'react-intl';
import enMessages from '../locales/en.json';
import esMessages from '../locales/es.json';
import zhMessages from '../locales/zh.json';

type Locale = 'en' | 'es' | 'zh';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, string>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const messages: Record<Locale, Record<string, string>> = {
  en: enMessages,
  es: esMessages,
  zh: zhMessages,
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(() => {
    // Try to get locale from localStorage or browser settings
    const savedLocale = localStorage.getItem('dafi_locale') as Locale;
    const browserLocale = navigator.language.split('-')[0] as Locale;
    return savedLocale || browserLocale || 'en';
  });

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('dafi_locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const contextValue = {
    locale,
    setLocale: handleSetLocale,
    messages: messages[locale],
  };

  return (
    <I18nContext.Provider value={contextValue}>
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
