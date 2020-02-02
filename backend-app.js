
"use strict";

var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');
const MemoryStore = require('./model.js')
const memoryStore = new MemoryStore()

const feederAppPort = 3000;

var feederApp = express();
var eventBroker = null;

module.exports = {
  setup: function (eBroker) {

  	eventBroker = eBroker;
	feederApp.oauth = new OAuthServer({
	  //feederApp.oauth has 'authenticate', 'authorize', 'constructor', 'token'.
	  model: memoryStore, // See https://github.com/oauthjs/node-oauth2-server for specification
	});
	 
	feederApp.use(bodyParser.urlencoded({ extended: false }));
	feederApp.use(bodyParser.json());


	//returns access toekn atter successful authentication. 
	feederApp.post('/oauth/token', feederApp.oauth.token());


	feederApp.post('/eventpush', feederApp.oauth.authenticate(), function(req, res) {
	  // Requires a valid access_token.
//	  console.log("got eventpush", req.body)
	  eventBroker.pushMessage(req.body);
 	  console.log(`Peer access for feeder ${req.connection.remoteAddress}`);
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'feederApplication/json');
	  res.send({"response": "OK"});
	});


	feederApp.listen(feederAppPort, ()=>console.info(`feeder listening to port ${feederAppPort}`));

  }
};


