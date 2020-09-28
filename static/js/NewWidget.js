export default class {

  constructor(plugin,uuid,config,geometry) {

    this.plugin = plugin;
    this.uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    this.config = {};
    this.geometry = {};
    this.debug = false;

    if(new URLSearchParams(window.location.search).get('newWidgetDEBUG') === 'true') {  // append  ?...&newWidgetDEBUG=true to the URL to get debug outut from this module
        console.log("NewWidget debug enabled");
        this.debug = true;
    }

    if (uuid != null) { this.uuid  = uuid; } 
    if (config != null) { this.config  = config; } 
    if (geometry != null) { this.geometry  = geometry; } 


    if(this.debug) { console.log("Inserting/Updating new Widget: ", this);}
  }

  get pluginToAdd() {
  	return this.plugin;
  }

  get pluginUUID() {
  	return this.uuid;
  }
  getConfig() {
    return this.config;
  }

/*
  getDefaultConfig() {
    return this.defaultConfig;
  }

  setDefaultConfig(value) {
    this.defaultConfig = value;
  } 
*/
  setConfig(name, value) {
  	this.config[name] = value;
  } 

/*
  setIndexedConfig(group, index, name, value) {
    if(typeof this[group] === 'undefined') {
        this[group] = [];
    }
    if(typeof this[group][index] === 'undefined') {
      this[group][index] = {};
    }
    this[group][index][name] = value;
  } */ 
}
