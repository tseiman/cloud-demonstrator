export default class {

  constructor(newClientIDcallback) {
    console.log("instantiating Event Broker");
    this.callback = newClientIDcallback;
    this.filter = "--";
    this.debug = false;

    if(new URLSearchParams(window.location.search).get('eventDEBUG') === 'true') {  // append  ?...&eventDEBUG=true to the URL to get debug outut from this event broker
        this.debug = true;
    }
  }

  handleIncommingMessage(msg) {
    if(this.debug) { console.log("got message in handleIncommingMessage", msg,window.globalWidgetList); }

    if(msg.clientid != null) {
      if(!(msg.clientid in window.globalClientList)) {
        if(this.callback != null) {
          this.callback(msg.clientid);
        }
      }
    }

    if(this.filter !== '--') {
      if(msg.clientid !== this.filter) {
        return;
      }
    }

    for (var i = 0, keys = Object.keys(window.globalWidgetList), ii = keys.length; i < ii; i++) {
 //     console.log('key : ' + keys[i] + ' val : ' + window.globalWidgetList[keys[i]]);
      window.globalWidgetList[keys[i]].logic.feedData(msg);
    }

  }
/*
  registerListener() {


  }
*/
  setFilter(f) {
    this.filter = f;
    console.log("setting filter for ClientEventBroker", f);
  }
}
