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
    "@iobroker/adapter-react": "^0.1.0",
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
