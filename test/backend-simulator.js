
require('dotenv').config()
const request = require('request-promise')
const btoa = require('btoa')

global.temperature = 0;
global.huminity = 1;
global.clientid = 0;
global.switchstate = false;
// const { ISSUER, CLIENT_ID, CLIENT_SECRET, SCOPE } = process.env

const [,, uri, method, body] = process.argv
//if (!uri) {
//  console.log('Usage: node client {url} [{method}] [{jsonData}]')
//  process.exit(1)
// }

const sendAPIRequest = async () => {
  const token = btoa('dummy-client-id:dummy-client-secret');
  try {
    const auth = await request({
      uri: 'http://localhost:3000/oauth/token',
      json: true,
      method: 'POST',
      headers: {
        authorization: `Basic ${token}`
      },
      form: {
        grant_type: 'client_credentials' //,
//        scope: SCOPE
      }
    })





    var intervalID = setInterval(async function(){

    	var temperatureAbs =  Math.round(Math.sin((temperature / 10) * Math.PI) * 15 +15);
    	var huminityAbs =  Math.round(Math.sin((huminity / 10) * Math.PI) * 50 + 50);
      switchstate = !switchstate;
		var ts = Math.round((new Date()).getTime() / 1000) ;
  	    const response = await request({
	      uri: 'http://localhost:3000/eventpush',
	      method: 'POST',
	      json: true,
	      body: {"clientid":"client-" + clientid, "time": ts, "data":{"temperature":temperatureAbs, "huminity": huminityAbs, "myswitchstate" : switchstate}},
	      headers: {
	        authorization: `${auth.token_type} ${auth.access_token}`
	      }
	    });

	    ++huminity;
	    ++temperature;
	    ++clientid;
	    if(temperature > 15) {
    		temperature = 0;
    	}
    	if(huminity > 15) {
    		huminity = 0;
    	}  
    	if(clientid > 2) {
    		clientid = 0;
    	}  
    	console.log("push" ,huminity,temperature , response)
    } ,1000);


  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

sendAPIRequest()