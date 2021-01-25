import React from 'react';
import Connection, {PROGRESS} from './Connection';
import * as Sentry from '@sentry/browser';

import DialogError from './Dialogs/Error';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

import IconSave from '@material-ui/icons/Save';
import IconClose from '@material-ui/icons/Close';

import printPrompt from './Prompt';
import theme from './Theme';
import Loader from './Components/Loader';
import Router from './Components/Router';
import Utils from './Components/Utils';
import I18n from './i18n';

import './index.css';

if (!window.localStorage) {
    window.localStorage = {
        getItem: () => null,
        setItem: () => null,
    };
}

const styles = {
    buttonIcon: {
        marginRight: 8
    },
};


/**
 * @extends {Router<import('./types').GenericAppProps, import('./types').GenericAppState>}
 */
class GenericApp extends Router {
    /**
     * @param {import('./types').GenericAppProps} props
     * @param {import('./types').GenericAppSettings | undefined} settings
     */
    constructor(props, settings) {
        super(props);

        printPrompt();

        let query = (window.location.search || '').replace(/^\?/, '').replace(/#.*$/, '');
        let args = {};
        query.trim().split('&').filter(t => t.trim()).forEach(b => {
            const parts = b.split('=');
            args[parts[0]] = parts.length === 2 ? parts[1] : true;
        });

        // extract instance from URL
        this.instance = args.instance !== undefined ? parseInt(args.instance, 10) || 0 : (parseInt(window.location.search.slice(1), 10) || 0);
        // extract adapter name from URL
        const tmp = window.location.pathname.split('/');
        this.adapterName = (settings && settings.adapterName) || props.adapterName || window.adapterName || tmp[tmp.length - 2] || 'iot';
        this.instanceId  = 'system.adapter.' + this.adapterName + '.' + this.instance;

        const location = Router.getLocation();
        location.tab = location.tab || window.localStorage.getItem(this.adapterName + '-adapter') || '';

        const themeInstance = this.createTheme();

        this.state = {
            selectedTab: window.localStorage.getItem(this.adapterName + '-adapter') || '',
            selectedTabNum: -1,
            native: {},
            errorText: '',
            changed: false,
            connected: false,
            loaded: false,
            isConfigurationError: '',
            toast: '',
            theme:          themeInstance,
            themeName:      this.getThemeName(themeInstance),
            themeType:      this.getThemeType(themeInstance),
            bottomButtons: (settings && settings.bottomButtons) === false ? false : ((props && props.bottomButtons) === false ? false : true),
            width:          GenericApp.getWidth(),
        };

        // init translations
        const translations = {
            'en': require('./i18n/en.json'),
            'de': require('./i18n/de.json'),
            'ru': require('./i18n/ru.json'),
            'pt': require('./i18n/pt.json'),
            'nl': require('./i18n/nl.json'),
            'fr': require('./i18n/fr.json'),
            'it': require('./i18n/it.json'),
            'es': require('./i18n/es.json'),
            'pl': require('./i18n/pl.json'),
            'zh-cn': require('./i18n/zh-cn.json'),
        };

        // merge together
        if (settings && settings.translations) {
            Object.keys(settings.translations).forEach(lang => translations[lang] = Object.assign(translations[lang], settings.translations[lang]));
        } else if (props.translations) {
            Object.keys(props.translations).forEach(lang => translations[lang] = Object.assign(translations[lang], props.translations[lang]));
        }

        I18n.setTranslations(translations);

        try {
            this.isIFrame = window.self !== window.top;
        } catch (e) {
            this.isIFrame = true;
        }

        this.savedNative = {}; // to detect if the config changed

        this.encryptedFields = props.encryptedFields || (settings && settings.encryptedFields) || [];

        this.socket = new Connection({
            ...((props && props.socket) || (settings && settings.socket)),
            name: this.adapterName,
            doNotLoadAllObjects: (settings && settings.doNotLoadAllObjects),
            onProgress: progress => {
                if (progress === PROGRESS.CONNECTING) {
                    this.setState({connected: false});
                } else if (progress === PROGRESS.READY) {
                    this.setState({connected: true});
                } else {
                    this.setState({connected: true});
                }
            },
            onReady: (objects, scripts) => {
                I18n.setLanguage(this.socket.systemLang);

                this.getSystemConfig()
                    .then(obj => {
                        this._secret = (typeof obj !== 'undefined' && obj.native && obj.native.secret) || 'Zgfr56gFe87jJOM';
                        return this.socket.getObject(this.instanceId);
                    })
                    .then(obj => {
                        let waitPromise;

                        // read UUID and init sentry with it.
                        if (!this.sentryInited) {
                            this.sentryInited = true;

                            if (window.location.host !== 'localhost:3000') {
                                waitPromise = this.socket.getObject('system.meta.uuid')
                                    .then(uuidObj => {
                                        if (uuidObj && uuidObj.native && uuidObj.native.uuid) {
                                            Sentry.configureScope(scope =>
                                                scope.setUser({id: uuidObj.native.uuid}));
                                        }
                                    });
                            }
                        }
                        waitPromise = waitPromise || Promise.resolve();

                        waitPromise
                            .then(() => {
                                if (obj) {
                                    this.common = obj && obj.common;
                                    this.onPrepareLoad(obj.native); // decode all secrets
                                    this.setState({native: obj.native, loaded: true}, () => this.onConnectionReady && this.onConnectionReady());
                                } else {
                                    console.warn('Cannot load instance settings');
                                    this.setState({native: {}, loaded: true}, () => this.onConnectionReady && this.onConnectionReady());
                                }
                            });
                    });
            },
            onError: err => {
                console.error(err);
                this.showError(err);
            }
        });
    }

    /**
     * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
     */
    componentDidMount() {
        window.addEventListener('resize', this.onResize, true);
        super.componentDidMount();
    }

    /**
     * Called immediately before a component is destroyed.
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, true);
        super.componentWillUnmount();
    }

    /**
     * @private
     */
    onResize = () => {
        this.resizeTimer && clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.resizeTimer = null;
            this.setState({width: GenericApp.getWidth()});
        }, 200)
    };

    /**
     * Gets the width depending on the window inner width.
     * @returns {import('./types').Width}
     */
    static getWidth() {
        /**
         * innerWidth |xs      sm      md      lg      xl
         *            |-------|-------|-------|-------|------>
         * width      |  xs   |  sm   |  md   |  lg   |  xl
         */

        const SIZES = {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920
        };
        const width = window.innerWidth;
        const keys = Object.keys(SIZES).reverse();
        const widthComputed = keys.find(key => width >= SIZES[key]);

        return widthComputed || 'xs';
    }

    /**
     * Get a theme
     * @param {string} name Theme name
     * @returns {import('./types').Theme}
     */
    createTheme(name = '') {
        return theme(Utils.getThemeName(name));
    }

    /**
     * Get the theme name
     * @param {import('./types').Theme} theme Theme
     * @returns {string} Theme name
     */
    getThemeName(theme) {
        return theme.name;
    }

    /**
     * Get the theme type
     * @param {import('./types').Theme} theme Theme
     * @returns {string} Theme type
     */
    getThemeType(theme) {
        return theme.palette.type;
    }

    /**
     * Changes the current theme
     */
    toggleTheme() {
        const themeName = this.state.themeName;

        const newThemeName = themeName === 'dark' ? 'blue' :
            themeName === 'blue' ? 'colored' : themeName === 'colored' ? 'light' :
                themeName === 'light' ? 'dark' : 'colored';

        Utils.setThemeName(newThemeName);

        const theme = this.createTheme(newThemeName);

        this.setState({
            theme: theme,
            themeName: this.getThemeName(theme),
            themeType: this.getThemeType(theme)
        });
    }

    /**
     * Gets the system configuration.
     * @returns {Promise<ioBroker.OtherObject>}
     */
    getSystemConfig() {
        if (this.socket.objects && this.socket.objects['system.config']) {
            return Promise.resolve(this.socket.objects['system.config']);
        } else {
            // @ts-ignore
            return this.socket.getObject('system.config');
        }
    }

    /**
     * Gets called when the socket.io connection is ready.
     * You can overload this function to execute own commands.
     */
    onConnectionReady() {
    }

    /**
     * Encrypts a string.
     * @param {string} value
     * @returns {string}
     */
    encrypt(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(this._secret[i % this._secret.length].charCodeAt(0) ^ value.charCodeAt(i));
        }
        return result;
    }

    /**
     * Decrypts a string.
     * @param {string} value
     * @returns {string}
     */
    decrypt(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(this._secret[i % this._secret.length].charCodeAt(0) ^ value.charCodeAt(i));
        }
        return result;
    }

    /**
     * Gets called when the navigation hash changes.
     * You may override this if needed.
     */
    onHashChanged() {
        const location = Router.getLocation();
        if (location.tab !== this.state.selectedTab) {
            this.selectTab(location.tab);
        }
    }

    /**
     * Selects the given tab.
     * @param {string} tab
     * @param {number} [index]
     */
    selectTab(tab, index) {
        window.localStorage[this.adapterName + '-adapter'] = tab;
        this.setState({selectedTab: tab, selectedTabNum: index})
    }

    /**
     * Gets called before the settings are saved.
     * You may override this if needed.
     * @param {Record<string, any>} settings
     */
    onPrepareSave(settings) {
        // here you can encode values
        this.encryptedFields && this.encryptedFields.forEach(attr => {
            if (settings[attr]) {
                settings[attr] = this.encrypt(settings[attr]);
            }
        });

        return true;
    }

    /**
     * Gets called after the settings are loaded.
     * You may override this if needed.
     * @param {Record<string, any>} settings
     */
    onPrepareLoad(settings) {
        // here you can encode values
        this.encryptedFields && this.encryptedFields.forEach(attr => {
            if (settings[attr]) {
                settings[attr] = this.decrypt(settings[attr]);
            }
        });
    }

    /**
     * Gets the extendable instances.
     * @returns {Promise<any[]>}
     */
    getExtendableInstances() {
        return new Promise(resolve => {
            this.socket._socket.emit('getObjectView', 'system', 'instance', null, (err, doc) => {
                if (err) {
                    resolve([]);
                } else {
                    resolve(doc.rows.filter(item => item.value.common.webExtendable).map(item => item.value));
                }
            });
        });
    }

    /**
     * Gets the IP addresses of the given host.
     * @param {string} host
     */
    getIpAddresses(host) {
        return new Promise((resolve, reject) => {
            this.socket._socket.emit('getHostByIp', host || this.common.host, (ip, _host) => {
                const IPs4 = [{name: '[IPv4] 0.0.0.0 - ' + I18n.t('ra_Listen on all IPs'), address: '0.0.0.0', family: 'ipv4'}];
                const IPs6 = [{name: '[IPv6] ::',      address: '::',      family: 'ipv6'}];
                if (_host) {
                    host = _host;
                    if (host.native.hardware && host.native.hardware.networkInterfaces) {
                        Object.keys(host.native.hardware.networkInterfaces).forEach(eth =>
                            host.native.hardware.networkInterfaces[eth].forEach(inter => {
                                if (inter.family !== 'IPv6') {
                                    IPs4.push({name: '[' + inter.family + '] ' + inter.address + ' - ' + eth, address: inter.address, family: 'ipv4'});
                                } else {
                                    IPs6.push({name: '[' + inter.family + '] ' + inter.address + ' - ' + eth, address: inter.address, family: 'ipv6'});
                                }
                            }));
                    }
                    IPs6.forEach(ip => IPs4.push(ip));
                }
                resolve(IPs4);
            });
        });
    }

    /**
     * Saves the settings to the server.
     * @param {boolean} isClose True if the user is closing the dialog.
     */
    onSave(isClose) {
        let oldObj;
        if (this.state.isConfigurationError) {
            this.setState({errorText: this.state.isConfigurationError});
            return;
        }

        this.socket.getObject(this.instanceId)
            .then(_oldObj => {
                oldObj = _oldObj || {};

                for (const a in this.state.native) {
                    if (this.state.native.hasOwnProperty(a)) {
                        oldObj.native[a] = this.state.native[a];
                    }
                }

                if (this.state.common) {
                    for (const b in this.state.common) {
                        if (this.state.common.hasOwnProperty(b)) {
                            oldObj.common[b] = this.state.common[b];
                        }
                    }
                }

                if (this.onPrepareSave(oldObj.native) !== false) {
                    return this.socket.setObject(this.instanceId, oldObj);
                }
            })
            .then(() => {
                this.savedNative = oldObj.native;
                this.setState({changed: false});
                isClose && GenericApp.onClose();
            });
    }

    /**
     * Renders the toast.
     * @returns {JSX.Element | null} The JSX element.
     */
    renderToast() {
        if (!this.state.toast) return null;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={true}
                autoHideDuration={6000}
                onClose={() => this.setState({toast: ''})}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.state.toast}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={this.props.classes.close}
                        onClick={() => this.setState({toast: ''})}
                    >
                        <IconClose />
                    </IconButton>,
                ]}
            />);
    }

    /**
     * Closes the dialog.
     * @private
     */
    static onClose() {
        if (typeof window.parent !== 'undefined' && window.parent) {
            try {
                if (window.parent.$iframeDialog && typeof window.parent.$iframeDialog.close === 'function') {
                    window.parent.$iframeDialog.close();
                } else {
                    window.parent.postMessage('close', '*');
                }
            } catch (e) {
                window.parent.postMessage('close', '*');
            }
        }
    }

    /**
     * Renders the error dialog.
     * @returns {JSX.Element | null} The JSX element.
     */
    renderError() {
        if (!this.state.errorText) {
            return null;
        } else {
            return <DialogError text={this.state.errorText} onClose={() => this.setState({errorText: ''})}/>;
        }
    }

    /**
     * Checks if the configuration has changed.
     * @param {Record<string, any>} [native] the new state
     */
    getIsChanged(native) {
        native = native || this.state.native;
        return JSON.stringify(native) !== JSON.stringify(this.savedNative);
    }

    /**
     * Gets called when loading the configuration.
     * @param {Record<string, any>} newNative The new configuration object.
     */
    onLoadConfig(newNative) {
        if (JSON.stringify(newNative) !== JSON.stringify(this.state.native)) {
            this.setState({native: newNative, changed: this.getIsChanged(newNative)})
        }
    }

    /**
     * Sets the configuration error.
     * @param {string} errorText
     */
    setConfigurationError(errorText) {
        if (this.state.isConfigurationError !== errorText) {
            this.setState({isConfigurationError: errorText});
        }
    }

    /**
     * Renders the save and close buttons.
     * @returns {JSX.Element | undefined} The JSX element.
     */
    renderSaveCloseButtons() {
        if (!this.state.bottomButtons) {
            return;
        }

        const narrowWidth = this.state.width === 'xs' || this.state.width === 'sm' || this.state.width === 'md';
        const buttonStyle = {
            borderRadius: this.state.theme.saveToolbar.button.borderRadius || 3,
            height: this.state.theme.saveToolbar.button.height || 32,
        };

        return <Toolbar position="absolute" style={{bottom: this.isIFrame ? 38 : 0, left: 0, right: 0, position: 'absolute', background: this.state.theme.saveToolbar.background}}>
            <Fab
                variant="extended"
                aria-label="Save"
                disabled={!this.state.changed}
                onClick={() => this.onSave(false)}
                style={buttonStyle}
            >
                <IconSave style={!narrowWidth ? styles.buttonIcon : {}}/>{!narrowWidth && I18n.t('ra_Save')}
            </Fab>
            <Fab
                variant="extended"
                aria-label="Save and close"
                disabled={!this.state.changed}
                onClick={() => this.onSave(true)}
                style={Object.assign({}, buttonStyle, {marginLeft: 10})}>
                <IconSave style={!narrowWidth ? styles.buttonIcon : {}}/>
                {!narrowWidth ? I18n.t('ra_Save and close') : '+'}
                {narrowWidth && <IconClose/>}
            </Fab>
            <div style={{flexGrow: 1}}/>
            <Fab variant="extended" aria-label="Close" onClick={() => GenericApp.onClose()} style={buttonStyle}>
                <IconClose style={!narrowWidth ? styles.buttonIcon : {}}/>{!narrowWidth && I18n.t('ra_Close')}
            </Fab>
        </Toolbar>;
    }

    /**
     * @private
     * @param {Record<string, any>} obj
     * @param {any} attrs
     * @param {any} value
     * @returns {boolean | undefined}
     */
    _updateNativeValue(obj, attrs, value) {
        if (typeof attrs !== 'object') {
            attrs = attrs.split('.');
        }
        const attr = attrs.shift();
        if (!attrs.length) {
            if (value && typeof value === 'object') {
                if (JSON.stringify(obj[attr]) !== JSON.stringify(value)) {
                    obj[attr] = value;
                    return true;
                }
            } else if (obj[attr] !== value) {
                obj[attr] = value;
                return true;
            } else {
                return false;
            }

        } else {
            obj[attr] = obj[attr] || {};
            if (typeof obj[attr] !== 'object') {
                throw new Error('attribute ' + attr + ' is no object, but ' + typeof obj[attr]);
            }
            return this._updateNativeValue(obj[attr], attrs, value);
        }
    }

    /**
     * Update the native value
     * @param {string} attr The attribute name with dots as delimiter.
     * @param {any} value The new value.
     * @param {(() => void)} [cb] Callback which will be called upon completion.
     */
    updateNativeValue(attr, value, cb) {
        const native = JSON.parse(JSON.stringify(this.state.native));
        if (this._updateNativeValue(native, attr, value)) {
            const changed = this.getIsChanged(native);
            this.setState({native, changed}, cb);
        }
    }

    /**
     * Set the error text to be shown.
     * @param {string} text
     */
    showError(text) {
        this.setState({errorText: text});
    }

    /**
     * Sets the toast to be shown.
     * @param {string} toast
     */
    showToast(toast) {
        this.setState({toast});
    }

    /**
     * Renders this component.
     * @returns {JSX.Element} The JSX element.
     */
    render() {
        if (!this.state.loaded) {
            return <Loader theme={this.state.themeType}/>;
        }

        return <div className="App">
            {this.renderError()}
            {this.renderToast()}
            {this.renderSaveCloseButtons()}
        </div>;
    }
}

export default GenericApp;
