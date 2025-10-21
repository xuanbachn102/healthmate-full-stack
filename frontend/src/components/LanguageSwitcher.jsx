import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          i18n.language === 'en'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('vi')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          i18n.language === 'vi'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        VI
      </button>
    </div>
  );
};

export default LanguageSwitcher;
