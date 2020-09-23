/**
 *
 * Project: cloud-demonstrator
 * Project Page: https://github.com/tseiman/cloud-demonstrator
 * Author: Thomas Schmidt
 * Date: 2020
 * 
 * This class offers a web service where JSON can be pushed to
 * The JSON Data might be in the format:
 *
 * {
 *  clientid: 'someclientid',
 *  time: 1600892937,
 *  data: { temperature: 24, huminity: 65 }
 * }
 *
 * the message received on the open API port is forwarded to the Server Event Broker
 * the Service is protected by OAUth (see model.js)
 *
 **/

"use strict";

var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');
const MemoryStore = require('./model.js')
const memoryStore = new MemoryStore()
const config = require('config');

const backendConf = config.get('backend');



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


	feederApp.listen(backendConf.apiport, ()=>console.info(`feeder listening to port ${backendConf.apiport}`));

  }
};


