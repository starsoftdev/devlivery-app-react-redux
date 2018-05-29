## Requirements
1. [Node.js](https://nodejs.org/en/download/)
2. [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)


## Run frontend app for development
1. `yarn install`
2. `yarn start`
This will start the app at http://localhost:3000 and launch a browser.


## Run frontend app for production:
1. Install all packages `yarn install`
2. Run `yarn build --release`
3. Go to build directory `cd build`
4. Install production packages `yarn install`
5. Run `yarn start`
You can modify PORT|API_URL (more variables in /src/config.js) using Environment Variables e.g. `yarn start PORT=9000`
