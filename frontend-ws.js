
/**
 *
 * Project: cloud-demonstrator
 * Project Page: https://github.com/tseiman/cloud-demonstrator
 * Author: Thomas Schmidt
 * Date: 2020
 * 
 * This connects the Browser WebUI via socketIO library (may using WebSocket or long poll)
 * to the EventBroker. Events received from the EventBroker are forwarded via SocketIO (e.g. WebSocket)
 * to the browser. On that side the ClientEventBroker will receive the message over SocketIO (WebSocket) 
 * and distribute it to the widgets.
 *
 **/

"use strict";

const http = require('http');
const io = require('socket.io')();
const socketAuth = require('socketio-auth');
const sha384 = require('js-sha512').sha384;
const resolve = require('path').resolve;
const config = require('config');

const frontendConf = config.get('frontend');



const pluginManager = require('./pluginManager');



const server = http.createServer();



var authenticated = false;

var eventBroker = null;

io.attach(server);
// mit Zertifikaten !! https://github.com/websockets/ws/issues/1333


// dummy user verification
async function verifyUser (data) {

	return new Promise((resolve, reject) => {
    // setTimeout to mock a cache or database call
	    setTimeout(() => {
	      // this information should come from your cache or database

	      try {
	      	var user = null;
	      	if(frontendConf.uselogin) {
				user =  frontendConf.users.find((user) => user.passwordhashSHA384 === sha384(data.password));

	      	} else { 
	      		user =  frontendConf.users[0];  // in case login is disabled in config/default.json we just use the default user
	      	}

			// console.log(data);

			if (typeof user === 'undefined') {
				return reject('USER_NOT_FOUND');
			}

			if (!user) {
				return reject('USER_NOT_FOUND');
			}

			return resolve(user);

			} catch (e) {
				return reject('USER_NOT_FOUND');
			}
			return reject('USER_NOT_FOUND');


		}, 200);
	});
}

socketAuth(io, {
	authenticate: async (socket, data, callback) => {
		const { token } = data;
		try {
			const user = await verifyUser(data);

			socket.user = user;

			return callback(null, true);
		} catch (e) {
			console.log(`Socket ${socket.id} unauthorized.`);
			return callback({ message: 'UNAUTHORIZED' });
		}
	},
	postAuthenticate: (socket) => {
		console.log(`Socket ${socket.id} authenticated.`);
		eventBroker.registerListener(function(msg) {
			console.log("frontend ws got message via broker: ", msg);
			io.emit('pushMessage', msg);
		});
//		socket.on('widgetList', function(msg){
//			 io.emit('widgetList', pluginManager.listPlugins("widget"));
//		});

	},
	disconnect: (socket) => {
		console.log(`Socket ${socket.id} disconnected.`);
	} 
})




module.exports = {
	setup: function (eBroker) {
		eventBroker = eBroker;
		server.listen(frontendConf.websocketport, ()=>console.info(`frontent socket.io listening to port ${frontendConf.websocketport}`));



	}
};


