

const http = require('http');
const io = require('socket.io')();
const socketAuth = require('socketio-auth');
const sha384 = require('js-sha512').sha384;
const resolve = require('path').resolve;

const pluginManager = require('./pluginManager');

const wsPort = 3002;


const server = http.createServer();



var authenticated = false;

io.attach(server);
// mit Zertifikaten !! https://github.com/websockets/ws/issues/1333


// dummy user verification
async function verifyUser (data) {

	return new Promise((resolve, reject) => {
    // setTimeout to mock a cache or database call
	    setTimeout(() => {
	      // this information should come from your cache or database
	      const users = [
	      {
	      	id: 1,
	      	name: 'Thomas',
	      	passwordhashSHA384: '8a65f1ace201d1a3ddaed9102be20fd75273075b4a59124529c0e85104568e81e02ebdac4183f176a1cb24ec7d125e54',
	      },
	      ];

	      try {
	//		const user =  users.find((user) => user.passwordhashSHA384 === sha384(data.password));

			const user =  users[0];

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
//		socket.on('widgetList', function(msg){
//			 io.emit('widgetList', pluginManager.listPlugins("widget"));
//		});

	},
	disconnect: (socket) => {
		console.log(`Socket ${socket.id} disconnected.`);
	} 
})




module.exports = {
	setup: function () {

		server.listen(wsPort, ()=>console.info(`frontent socket.io listening to port ${wsPort}`));



	}
};


