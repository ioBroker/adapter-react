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
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-scripts": "^3.0.1",
    "@material-ui/core": "^4.2.0",
    "react-icons": "^3.7.0",
    "@iobroker/adapter-react": "^actual-version",
    "gulp": "^4.0.2",
    "del": "^5.0.0"
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
1. Copy `vendor` folder: from `node_modules/@iobroker/adapter-react/` into `src/public`
2. Add socket.io to public/index.html
After

```
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```

insert

```
    <script type="text/javascript" src="%PUBLIC_URL%/vendor/socket.io.js"></script>
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

4. Add to App.js encoding and decoding of values:
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

#### SelectID.js
