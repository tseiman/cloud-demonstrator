/**
 *
 * Project: cloud-demonstrator
 * Project Page: https://github.com/tseiman/cloud-demonstrator
 * Author: Thomas Schmidt
 * Date: 2020
 * 
 * A very simple Server EventBroker class. 
 *   Subscribers can register via registerListener(listener); 
 *   on registration the a callback is given via listener parameter. 
 *   The callback function should implment a message parameter. function(msg) {...}
 *
 *   messages are pushed to EventBroker via pushMessage(msg); the event broker will 
 *   iterate trough all registered listeners and call the callback function for each.
 *
 **/
"use strict";



module.exports = class EventBroker {

	constructor(){
		console.log("instantiating Event Broker");
		this.receiverCallback = new Array();
 	}


 	pushMessage(msg) {
		console.log("got message on broker: ", msg);
		this.receiverCallback.forEach((element) => {
    		element(msg);
		});

 	}


 	registerListener(listener) {
		console.log("got new listner on broker: ", listener);
		this.receiverCallback.push(listener);

 	}

}