
var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');
const MemoryStore = require('./model.js')
const memoryStore = new MemoryStore()

const feederAppPort = 3000;

var feederApp = express();

module.exports = {
  setup: function () {

	feederApp.oauth = new OAuthServer({
	  //feederApp.oauth has 'authenticate', 'authorize', 'constructor', 'token'.
	  model: memoryStore, // See https://github.com/oauthjs/node-oauth2-server for specification
	});
	 
	feederApp.use(bodyParser.urlencoded({ extended: false }));
	feederApp.use(bodyParser.json());
	//feederApp.use(feederApp.oauth.authorize());

/*
	feederApp.oauth.authenticate(req, res).then((token) => {
    	console.log(token.client);
    	console.log(token.user);
  	});
*/

	//returns access toekn atter successful authentication. 
	feederApp.post('/oauth/token', feederApp.oauth.token());


/*
	feederApp.get('/secret', feederApp.oauth.authenticate(), function(req, res) {
	  // Requires a valid access_token.
 	  console.log(`Peer checked succcessfuly access to feeder ${req.connection.remoteAddress}`);
	  res.send('Secret area');
	});
*/

	feederApp.post('/eventpush', feederApp.oauth.authenticate(), function(req, res) {
	  // Requires a valid access_token.
	 // console.log(`got eventpush ${body}`)
 	  console.log(`Peer access for feeder ${req.connection.remoteAddress}`);
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'feederApplication/json');
	  res.send({"response": "OK"});
	});

/*
	feederApp.get('/', function(req, res) {
	  // Does not require an access_token.
		res.render('index');
	});
*/
	
	feederApp.listen(feederAppPort, ()=>console.info(`feeder listening to port ${feederAppPort}`));

  }
};


