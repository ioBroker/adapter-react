/***
 * Copyright 2018-2019 bluefox <dogafox@gmail.com>
 *
 * MIT License
 *
 ***/

 /**
  * Translation string management.
  */
class I18n {
    /**
     * List of all languages with their translations.
     * @type {{ [lang in ioBroker.Languages]?: Record<string, string>; }}
     */
    static translations = {};

    /**
     * The currently displayed language.
     * @type {ioBroker.Languages}
     */
    static lang = window.sysLang || 'en';

    /**
     * Set the language to display.
     * @param {ioBroker.Languages} lang
     */
    static setLanguage(lang) {
        if (lang) {
            I18n.lang = lang;
        }
    }

    /**
     * Sets all translations (in all languages).
     * @param {{ [lang in ioBroker.Languages]?: Record<string, string>; }} translations
     */
    static setTranslations(translations) {
        if (translations) {
            I18n.translations = translations;
        }
    }

    /**
     * Get the currently chosen language.
     * @returns {ioBroker.Languages} The current language.
     */
    static getLanguage() {
        return I18n.lang;
    }

    /**
     * Translate the given string to the selected language.
     * @param {string} word The (key) word to look up the string.
     * @param {string[]} args Optional arguments which will replace the first (second, third, ...) occurence of %s
     */
    static t(word, ...args) {
        const translation = I18n.translations[I18n.lang];
        if (translation) {
            const w = translation[word];
            if (w) {
                word = w;
            } else {
                console.log(`Translate: ${word}`);
            }
        }
        for (const arg of args) {
            word = word.replace('%s', arg);
        }
        return word;
    }
}

/*I18n.translations = {
    'en': require('./i18n/en'),
    'ru': require('./i18n/ru'),
    'de': require('./i18n/de'),
};
I18n.fallbacks = true;
I18n.t = function () {};*/

export default I18n;