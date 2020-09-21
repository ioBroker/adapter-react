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
     * @param {string} [arg1] Optional argument which will replace the first occurence of %s
     * @param {string} [arg2] Optional argument which will replace the second occurence of %s
     * @param {string} [arg3] Optional argument which will replace the thrid occurence of %s
     */
    static t(word, arg1, arg2, arg3) {
        if (I18n.translations[I18n.lang]) {
            const w = I18n.translations[I18n.lang][word];
            if (w) {
                word = w;
            } else {
                console.log(`Translate: ${word}`);
            }
        }
        if (arg1 !== undefined) {
            word = word.replace('%s', arg1);
            if (arg2 !== undefined) {
                word = word.replace('%s', arg2);
                if (arg3 !== undefined) {
                    word = word.replace('%s', arg3);

                }
            }
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