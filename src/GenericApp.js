import React from 'react';
import Connection from './Connection';
import {PROGRESS} from './Connection';
import I18n from './i18n';
import DialogError from './Dialogs/Error';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

import {MdSave as IconSave} from 'react-icons/md'
import {MdClose as IconClose} from 'react-icons/md'

import Theme from './Theme';
import Loader from './Components/Loader';
import Router from './Components/Router';

if (!window.localStorage) {
    window.localStorage = {
        getItem: () => null,
        setItem: () => null,
    };
}

class GenericApp extends Router {
    constructor(props, settings) {
        super(props);

        // extract instance from URL
        this.instance = parseInt(window.location.search.slice(1), 10) || 0;
        // extract adapter name from URL
        const tmp = window.location.pathname.split('/');
        this.adapterName = (settings && settings.adapterName) || props.adapterName || tmp[tmp.length - 2] || 'iot';
        this.instanceId  = 'system.adapter.' + this.adapterName + '.' + this.instance;

        const location = Router.getLocation();
        location.tab = location.tab || window.localStorage[this.adapterName + '-adapter'] || '';

        this.state = {
            selectedTab: window.localStorage[this.adapterName + '-adapter'] || '',
            selectedTabNum: -1,
            native: {},
            errorText: '',
            changed: false,
            connected: false,
            loaded: false,
            isConfigurationError: '',
            themeType: 'light',
            toast: '',
            bottomButtons: settings && settings.bottomButtons === false ? false : (props && props.bottomButtons === false ? false : true),
        };

        // init translations
        if (settings && settings.translations) {
            I18n.setTranslations(settings.translations);
        } else if (props.translations) {
            I18n.setTranslations(props.translations);
        }

        try {
            this.isIFrame = window.self !== window.top;
        } catch (e) {
            this.isIFrame = true;
        }

        this.savedNative = {}; // to detect if the config changed

        this.encryptedFields = props.encryptedFields || (settings && settings.encryptedFields) || [];

        this.socket = new Connection({
            ...(props && props.socket),
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
                        if (obj) {
                            this.common = obj && obj.common;
                            this.onPrepareLoad(obj.native); // decode all secrets
                            this.setState({native: obj.native, loaded: true}, () => this.onConnectionReady && this.onConnectionReady());
                        } else {
                            console.warn('Cannot load instance settings');
                            this.setState({native: {}, loaded: true}, () => this.onConnectionReady && this.onConnectionReady());
                        }
                    });
            },
            onError: err => {
                console.error(err);
            }
        });
    }

    getSystemConfig() {
        if (this.socket.objects && this.socket.objects['system.config']) {
            return Promise.resolve(this.socket.objects['system.config']);
        } else {
            return this.socket.getObject('system.config')
        }
    }

    onConnectionReady() {
        // you can overload this function to execute own commands
    }

    encrypt(value) {
        let result = '';
        for(let i = 0; i < value.length; i++) {
            result += String.fromCharCode(this._secret[i % this._secret.length].charCodeAt(0) ^ value.charCodeAt(i));
        }
        return result;
    }

    decrypt(value) {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(this._secret[i % this._secret.length].charCodeAt(0) ^ value.charCodeAt(i));
        }
        return result;
    }

    onHashChanged() {
        const location = Router.getLocation();
        if (location.tab !== this.state.selectedTab) {
            this.selectTab(location.tab);
        }
    }

    selectTab(tab, index) {
        window.localStorage[this.adapterName + '-adapter'] = tab;
        this.setState({selectedTab: tab, selectedTabNum: index})
    }

    onPrepareSave(settings) {
        // here you can encode values
        this.encryptedFields && this.encryptedFields.forEach(attr => {
            if (settings[attr]) {
                settings[attr] = this.encrypt(settings[attr]);
            }
        });
    }

    onPrepareLoad(settings) {
        // here you can encode values
        this.encryptedFields && this.encryptedFields.forEach(attr => {
            if (settings[attr]) {
                settings[attr] = this.decrypt(settings[attr]);
            }
        });
    }

    getExtendableInstances() {
        return new Promise(resolve => {
            this.socket.socket.emit('getObjectView', 'system', 'instance', null, (err, doc) => {
                if (err) {
                    resolve([]);
                } else {
                    resolve(doc.rows.filter(item => item.value.common.webExtendable).map(item => item.value));
                }
            });
        });
    }

    getIpAddresses(host) {
        return new Promise((resolve, reject) => {
            this.socket.socket.emit('getHostByIp', host || this.common.host, (ip, _host) => {
                const IPs4 = [{name: '[IPv4] 0.0.0.0 - ' + I18n.t('Listen on all IPs'), address: '0.0.0.0', family: 'ipv4'}];
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

                this.onPrepareSave(oldObj.native);

                return this.socket.setObject(this.instanceId, oldObj);
            })
            .then(() => {
                this.savedNative = oldObj.native;
                this.setState({changed: false});
                isClose && GenericApp.onClose();
            });
    }

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

    renderError() {
        if (!this.state.errorText) return null;
        return (<DialogError text={this.state.errorText} onClose={() => this.setState({errorText: ''})}/>);
    }

    getIsChanged(native) {
        native = native || this.state.native;
        return JSON.stringify(native) !== JSON.stringify(this.savedNative);
    }

    onLoadConfig(newNative) {
        if (JSON.stringify(newNative) !== JSON.stringify(this.state.native)) {
            this.setState({native: newNative, changed: this.getIsChanged(newNative)})
        }
    }

    setConfigurationError(errorText) {
        if (this.state.isConfigurationError !== errorText) {
            this.setState({isConfigurationError: errorText});
        }
    }

    renderSaveCloseButtons() {
        if (!this.state.bottomButtons) {
            return;
        }
        const buttonStyle = {
            borderRadius: Theme.saveToolbar.button.borderRadius || 3,
            height: Theme.saveToolbar.button.height || 32,
        };

        return (
            <Toolbar position="absolute" style={{bottom: this.isIFrame ? 38 : 0, left: 0, right: 0, position: 'absolute', background: Theme.saveToolbar.background}}>
                <Fab variant="extended" aria-label="Save" disabled={!this.state.changed} onClick={() => this.onSave(false)} style={buttonStyle}>
                    <IconSave />{I18n.t('Save')}
                </Fab>
                <Fab variant="extended" aria-label="Save and close" disabled={!this.state.changed} onClick={() => this.onSave(true)} style={Object.assign({}, buttonStyle, {marginLeft: 10})}>
                    <IconSave />{I18n.t('Save and close')}
                </Fab>
                <div style={{flexGrow: 1}}/>
                <Fab variant="extended" aria-label="Close" onClick={() => GenericApp.onClose()} style={buttonStyle}>
                    <IconClose />{I18n.t('Close')}
                </Fab>
            </Toolbar>)
    }

    updateNativeValue(attr, value, cb) {
        const native = JSON.parse(JSON.stringify(this.state.native));
        if (value && typeof value === 'object') {
            if (JSON.stringify(native[attr]) !== JSON.stringify(value)) {
                native[attr] = value;
                const changed = this.getIsChanged(native);
                this.setState({native, changed}, cb);
            }
        } else if (native[attr] !== value) {
            native[attr] = value;
            const changed = this.getIsChanged(native);
            this.setState({native, changed}, cb);
        }
    }

    showError(text) {
        this.setState({errorText: text});
    }

    showToast(toast) {
        this.setState({toast});
    }

    render() {
        if (!this.state.loaded) {
            return (<Loader theme={this.state.themeType}/>);
        }

        return (
            <div className="App">
                {this.renderError()}
                {this.renderSaveCloseButtons()}
            </div>
        );
    }
}

export default GenericApp;
