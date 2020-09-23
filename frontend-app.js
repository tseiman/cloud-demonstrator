
/**
 *
 * Project: cloud-demonstrator
 * Project Page: https://github.com/tseiman/cloud-demonstrator
 * Author: Thomas Schmidt
 * Date: 2020
 * 
 * This provides the web service which delivers the WebUI.
 * The WebUI HTML is parsed from template EJS files stored in the "views" folder
 * additionally all Client (Browser) main page JS, CSS, Pictures is delivered by this class
 * as well as the widget plugin files (stored in plugin folder). 
 * Also the Plugins consist of EJS HTML templates for configuration and display the plugin widget itself.
 * The Plugins might include CSS, JS, Pictures,... which is delivered form here as well.
 *
 **/


"use strict";
var bodyParser = require('body-parser');
var express = require('express');
var viewerApp = express();
const pluginManager = require('./pluginManager');

const config = require('config');

const frontendConf = config.get('frontend');


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

	viewerApp.listen(frontendConf.webuiport, ()=>console.info(`viewer listening to port ${frontendConf.webuiport}`));

  }
};