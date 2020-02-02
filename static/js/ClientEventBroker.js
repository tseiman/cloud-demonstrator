export default class {

  constructor(newClientIDcallback) {
    console.log("instantiating Event Broker");
    this.callback = newClientIDcallback;
    this.filter = "--";
  }

  handleIncommingMessage(msg) {
//    console.log("got message in handleIncommingMessage", msg,window.globalWidgetList);

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
