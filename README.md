# Help ReactJS classes for adapter config
## Getting started
If you want to create the configuration page with react:
1. Create github repo for adapter.
2. execute `npx create-react-app src` . It will take a while.
3. `cd src`
4. Modify package.json file in src directory:
    - Change `name` from `src` to `ADAPTERNAME-admin` (Of course replace `ADAPTERNAME` with yours)
    - Add to dependencies:
      ```
      "@material-ui/core": "^4.2.0",
      "react-icons": "^3.7.0",
      "@iobroker/adapter-react": "^0.1.0",
      "gulp": "^4.0.2",
      "del": "^5.0.0"
      ```
      Versions can be higher.
      So your src/package.json should look like:
```
{
  "name": "ADAPTERNAME-admin",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "clsx": "^1.1.0",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-icons": "^3.10.0",
    "react-scripts": "^3.4.1",
    "@material-ui/core": "^4.10.2",
    "@material-ui/lab": "^4.0.0-alpha.56",
    "@iobroker/adapter-react": "^actual-version",
    "del": "^5.1.0",
    "gulp": "^4.0.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "homepage": ".",
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
```
5. Call in `src`: `npm install`
6. Copy gulpfile.js into `src`: `cp node_modules/@iobroker/adapter-react/gulpfile.js gulpfile.js`
7. Start your dummy application `npm run start` for developing or build with `npm run build` and
copy files in `build` directory to `www` or to `admin`. In admin you must rename `index.html` to `index_m.html`.
8. You can do that with `gulp` tasks: `gulp build`, `gulp copy`, `gulp renameIndex` or  `gulp renameTab`


## Development
1. Add socket.io to public/index.html
After

```
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```

insert

```
<script>
    var script = document.createElement('script');
    window.registerSocketOnLoad = function (cb) {
        window.socketLoadedHandler = cb;
    };
    const parts = (window.location.search || '').replace(/^\?/, '').split('&');
    const query = {};
    parts.forEach(item => {
        const [name, val] = item.split('=');
        query[decodeURIComponent(name)] = val !== undefined ? decodeURIComponent(val) : true;
    });
    script.onload = function () { typeof window.socketLoadedHandler === 'function' && window.socketLoadedHandler(); };
    script.src = window.location.port === '3000' ? window.location.protocol + '//' + (query.host || window.location.hostname) + ':' + (query.port || 8081) + '/lib/js/socket.io.js' : '%PUBLIC_URL%/../../lib/js/socket.io.js';

    document.head.appendChild(script);
</script>
```

3. Add to App.js constructor initialization for I18n:
```
class App extends GenericApp {
    constructor(props) {
        const extendedProps = {...props};
        extendedProps.encryptedFields = ['pass']; // this parameter will be encrypted and decrypted automatically
        extendedProps.translations = {
            'en': require('./i18n/en'),
            'de': require('./i18n/de'),
            'ru': require('./i18n/ru'),
            'pt': require('./i18n/pt'),
            'nl': require('./i18n/nl'),
            'fr': require('./i18n/fr'),
            'it': require('./i18n/it'),
            'es': require('./i18n/es'),
            'pl': require('./i18n/pl'),
            'zh-cn': require('./i18n/zh-cn'),
        };
        // get actual admin port
        extendedProps.socket = {port: parseInt(window.location.port, 10)};

        // only for debug purposes
        if (extendedProps.socket.port === 3000) {
            extendedProps.socket.port = 8081;
        }
        super(extendedProps);
    }
    ...
}
```

4. Replace index.js with following code to support themes:
```
import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider} from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';

import './index.css';
import App from './App';
import { version } from '../package.json';

import theme from '@iobroker/adapter-react/Theme';

console.log('iobroker.scenes@' + version);
let themeName = window.localStorage ? window.localStorage.getItem('App.theme') || 'light' : 'light';

function build() {
    return ReactDOM.render(<MuiThemeProvider theme={ theme(themeName) }>
        <App onThemeChange={_theme => {
            themeName = _theme;
            build();
        }}/>
    </MuiThemeProvider>, document.getElementById('root'));
}

build();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
```

5. Add to App.js encoding and decoding of values:
```
class App extend GenericApp {
    ...
    onPrepareLoad(settings) {
        settings.pass = this.decode(settings.pass);
    }
    onPrepareSave(settings) {
        settings.pass = this.encode(settings.pass);
    }
}
```

## Components

### Connection.js

### GenericApp.js

### i18n.js

### Theme.js

### Dialogs

#### Confirm.js
Usage: 
```
import React from 'react';
import ConfirmDialog from '@iobroker/adapter-react/Dialogs/Confirm'
import I18n from '@iobroker/adapter-react/i18n';

class ExportImportDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmDialog: false,
        };
    }   

    renderConfirmDialog() {
        if (!this.state.confirmDialog) {
            return null;
        }
        return <ConfirmDialog
            title={ I18n.t('Scene will be overwritten.') }
            text={ I18n.t('All data will be lost. Confirm?') }
            ok={ I18n.t('Yes') }
            cancel={ I18n.t('Cancel') }
            onClose={isYes => {
                this.setState({ confirmDialog: false} );
            }}
        />;
    }
    render() {
        return <div>
            <Button onClick={ () => this.setState({confirmDialog: true}) }>Click</Button>
            { this.renderConfirmDialog() }
        </div>
    }
}

export default ExportImportDialog;
```

#### Error.js

#### Message.js

#### SelectID.js

### Components

#### Utils.js
##### getObjectNameFromObj
`getObjectNameFromObj(obj, settings, options, isDesc)`

Get object name from single object.

Usage: `Utils.getObjectNameFromObj(this.objects[id], null, {language: I18n.getLanguage()})`

##### getObjectIcon
`getObjectIcon(id, obj)`

Get icon from object.

Usage: 
```
const icon = Utils.getObjectIcon(id, this.objects[id]);
return (<img src={icon}/>);
```

##### isUseBright
`isUseBright(color, defaultValue)`

Usage: `

#### Loader.js

#### Logo.js

#### Router.js

#### ObjectBrowser.js
