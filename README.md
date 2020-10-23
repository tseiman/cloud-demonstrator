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
```Shell
npm install
```

# run

## Without further parameters 
This requires full configuration in the config file
```Shell
node app.js
```

## Example run with SWI Octave
Here some security paramters are not configured in the configuration file and given via command line under **linux**:
```Shell
CD_REMOTEAPI_URL="https://octave-api.sierrawireless.io/v5.0/sierra_internal/event/&gt;my Command Stream ID>" CD_REMOTEAPI_USER="&gt;my octave username>" CD_REMOTEAPI_TOKEN="&gt;my octave token>"  node app.js
```

run unter Windows doesn't allow to set environment variables in one comamnd line with the execution command. Therefore the variables have to be exported before:

```Shell
set CD_REMOTEAPI_URL=https://octave-api.sierrawireless.io/v5.0/sierra_internal/event/<my Command Stream ID>
set CD_REMOTEAPI_USER=<my octave username>
set CD_REMOTEAPI_TOKEN=<my octave token>
node app.js
```
## run readymade packages
The Node JS application can be packed with the ```pkg``` command below. As a result one will become a EXE, a Linux ELF or MacOS executable. 
Instead of a full NodeJS intstallation only the executable and plugin, static data is requried.
An example of how to execute:

### Under Windows

```Shell
set CD_REMOTEAPI_URL=https://octave-api.sierrawireless.io/v5.0/sierra_internal/event/<my Command Stream ID>
set CD_REMOTEAPI_USER=<my octave username>
set CD_REMOTEAPI_TOKEN=<my octave token> 
CloudDemonstratorServer-win.exe
```


### Under Mac

```Shell
CD_REMOTEAPI_URL="https://octave-api.sierrawireless.io/v5.0/sierra_internal/event/<my Command Stream ID>"; CD_REMOTEAPI_USER="<my octave username>"; CD_REMOTEAPI_TOKEN="<my octave token>" ./CloudDemonstratorServer-macos
```

### Under Linux

```Shell
CD_REMOTEAPI_URL="https://octave-api.sierrawireless.io/v5.0/sierra_internal/event/<my Command Stream ID>"; CD_REMOTEAPI_USER="<my octave username>"; CD_REMOTEAPI_TOKEN="<my octave token>"" ./CloudDemonstratorServer-linux
```


# Build packages
Building packed executables for Windwos, Linux and MacOS:
```Shell
pkg .
```

# basic testing
* run the NodeJS cloud-demonstrator server app with `node app.js`
* run the Back2Back tester which feeds some data to the cloud-demonstrator by entering the test folder and run `node backend-simulator.js`. The backend simulator will now start to feed data. See the console output of the backend-simulator and of the cloud-demonstrator.
* open the cloud-demonstrator UI from a browser by accessing http://localhost:3001 .
* Load the browser-example-config.json from the test folder by clicking the cloud upload image in the browser UE.
* you should see now some data comming in.

