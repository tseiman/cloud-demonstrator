# cloud-demonstrator
Cloud demonstrator is a node.js application which provides a Backend where it takes JSON messages via HTTP(S) and forwards it via WebSockets to a simple Web/Browser based dashboard on the Frontend, a cloud based front end analytics platform is demonstrated

#dependencies
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


#install dependencies
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
