"use strict";


module.exports = class EventBroker {

	constructor(){
		console.log("instantiating Event Broker");
		this.receiverCallback = null;
 	}


 	pushMessage(msg) {
		console.log("got message on broker: ", msg);
		this.receiverCallback(msg);
 	}


 	registerListener(listener) {
		console.log("got new listner on broker: ", listener);
		this.receiverCallback = listener;

 	}

}