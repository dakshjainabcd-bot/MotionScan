import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', key: 'en' },
  { code: 'hi', key: 'hi' },
  { code: 'as', key: 'as' },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-2 p-2 text-sm border-b">
      <span className="text-gray-500">{t('language.label')}:</span>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-2 py-1 rounded ${
            i18n.language === lang.code ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          {t(`language.${lang.key}`)}
        </button>
      ))}
    </div>
  );
}