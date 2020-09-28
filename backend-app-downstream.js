/**
 *
 * Project: cloud-demonstrator
 * Project Page: https://github.com/tseiman/cloud-demonstrator
 * Author: Thomas Schmidt
 * Date: 2020
 * 
 *
 **/

"use strict";

const querystring = require('querystring');
const https = require('https');

const config = require('config');

const backendConf = config.get('backend');

var eventBroker = null;
var remoteURL = new URL(backendConf.remoteapi.url);

module.exports = {
  setup: function (eBroker) {
  	console.log("Startup downstream");
  	eventBroker = eBroker;

  	eventBroker.registerListener(function(msg){

  		if(typeof msg.routing === 'undefined') { return; }
  		if(msg.routing !== 'outgoing') { return; }


  		var port = remoteURL.port;
  		if(remoteURL.port === '') {
  			if(remoteURL.protocol === 'https') {
  				port = 443;
  			} else {
  				port = 443;
  			}
  		}

  		var msgWrapped = { "elems":   msg};

		var postData = JSON.stringify(msgWrapped);
console.log(postData);
		var options = {
		  "hostname": remoteURL.hostname,
		  "port": port,
		  "path": remoteURL.pathname,
		  method: 'POST',
		  headers: {
		  		'X-Auth-Token': backendConf.remoteapi.token,
     			'X-Auth-User': backendConf.remoteapi.user,
		    	'Content-Length': postData.length
		     }
		};

		
		var req = https.request(options, (res) => {
		  console.log('statusCode:', res.statusCode);
		  console.log('headers:', res.headers);

		  res.on('data', (d) => {
		  //  process.stdout.write(d.toString());
		  	console.log(d.toString('utf8'));
		  });
		});

		req.on('error', (e) => {
		  console.error(e);
		});

		req.write(postData);
		req.end();
  		

  	});

  }
};

/*



var postData = querystring.stringify({
    'msg' : 'Hello World!'
});

var options = {
  hostname: 'posttestserver.com',
  port: 443,
  path: '/post.php',
  method: 'POST',
  headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       'Content-Length': postData.length
     }
};

var req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();

*/