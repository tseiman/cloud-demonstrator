# cloud-demonstrator
Cloud demonstrator is a node.js application which provides a Backend where it takes JSON messages via HTTP(S) and forwards it via WebSockets to a simple Web/Browser based dashboard on the Frontend, a cloud based front end analytics platform is demonstrated

# dependencies
* node JS
* NPM
* "ejs": "^1.0.0",
* "express-oauth-server": "2.0.0",
* "socket.io": "2.3.0",
* "underscore": "1.9.0",
* "console-stamp": "0.2.9",
* "js-sha512": "0.8.0",
* "socketio-auth": "0.1.1",
* "config": ">=3.3.1"


# install dependencies
```
npm install
```

# run
```
node app.js
```

# Build packages
Building packed executables for Windwos, Linux and MacOS:
```
pkg .
```

# basic testing
* run the NodeJS cloud-demonstrator server app with `node app.js`
* run the Back2Back tester which feeds some data to the cloud-demonstrator by entering the test folder and run `node backend-simulator.js`. The backend simulator will now start to feed data. See the console output of the backend-simulator and of the cloud-demonstrator.
* open the cloud-demonstrator UI from a browser by accessing http://localhost:3001 .
* Load the browser-example-config.json from the test folder by clicking the cloud upload image in the browser UE.
* you should see now some data comming in.

