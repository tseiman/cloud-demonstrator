"use strict";
var bodyParser = require('body-parser');
var express = require('express');
var viewerApp = express();
const pluginManager = require('./pluginManager');


// resolve = require('path').resolve
// resolve('../../bb/tmp.txt')

const viewerAppPort = 3001;


module.exports = {
  setup: function () {


	viewerApp.set('view engine', 'ejs');
	viewerApp.use(express.static('static'));
	viewerApp.use(bodyParser.urlencoded({ extended: false }));
	viewerApp.use(bodyParser.json());
	viewerApp.get('/', function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
	  // Does not require an access_token.
	  console.log(`Client access for index page ${req.connection.remoteAddress}`);
	  res.render('index');
	});


	viewerApp.get('/plugins.json', function(req, res) {

//		res.header('Content-Type', "application/json" );
//		res.header("Access-Control-Allow-Origin", "*");
	  // Does not require an access_token.
//	  console.log(`Client access for index page ${req.connection.remoteAddress}`);
	  res.send(pluginManager.listPlugins("widget"));
	});

//	viewerApp.use(express.static('plugin'));
//	viewerApp.use('/plugin', express.static(path.join(__dirname, 'plugin')))
	viewerApp.use('/plugin', express.static('plugin'));

	viewerApp.listen(viewerAppPort, ()=>console.info(`viewer listening to port ${viewerAppPort}`));

  }
};