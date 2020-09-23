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