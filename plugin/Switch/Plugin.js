export default class {

 

  constructor(widgetConf,globalWidgetList,clientEventBroker) {
    this.widgetConf = widgetConf; 
    this.eventBroker = clientEventBroker;
    
    this.debug = false;
    if(new URLSearchParams(window.location.search).get('pluginSwitchDEBUG') === 'true') {  // append  ?...&pluginLineChartDEBUG=true to the URL to get debug outut from this module
        console.log("Plugin Switch debug enabled");
        this.debug = true;
    }

    
     
    var that = this;

    var  isNewWidgetAndNotUpdated =  (globalWidgetList[widgetConf.uuid] == null);

    
    if(this.debug) { console.log("new Switch generator with conf: ", widgetConf); }



    $.get('/plugin/' + widgetConf.pluginToAdd + '/template.ejs', function (template) {
        // Compile the EJS template.
        this.func = ejs.compile(template);
        this.options = widgetConf.config;
        this.options.uuid = widgetConf.uuid;
        this.options.strSegments = JSON.stringify(widgetConf.config.segment);

        this.html = this.func({data: this.options});


        let grid = $('.grid-stack').data('gridstack');

        this.widgetX      = 0;
        this.widgetY      = 0;
        this.widgetWidth  = 4;
        this.widgetHeight = 3;


        if( widgetConf.geometry != null) {
          if( widgetConf.geometry.x != null)      { this.widgetX = widgetConf.geometry.x; }
          if( widgetConf.geometry.y != null)      { this.widgetY = widgetConf.geometry.y; }
          if( widgetConf.geometry.width != null)  { this.widgetWidth = widgetConf.geometry.width; }
          if( widgetConf.geometry.height != null) { this.widgetHeight = widgetConf.geometry.height; }

        }

        if(isNewWidgetAndNotUpdated) {
          this.widget = grid.addWidget(this.html, this.widgetX, this.widgetY, this.widgetWidth, this.widgetHeight , false, null, null, null, null, this.options.uuid);
          window.setToolIconToGridItems(this.options.uuid);
        } else {

          let savedResizeBtn =  $('#' + this.options.uuid).find('.ui-resizable-handle');
          $('#' + this.options.uuid).empty();
          $('#' + this.options.uuid).html($(this.html).children() );
          $('#' + this.options.uuid).append(savedResizeBtn );



          window.setToolIconToGridItems(this.options.uuid);

        }

          $('#onoffswitch-' + this.options.uuid).change(function() {

              that.emitChange($(this).is(":checked"));

          }); 


    });


  }

  setJsonObject(data, path, val) {
    var k = data;
    var steps = path.split('.');
    var last = steps.pop();
    steps.forEach(e => (data[e] = data[e] || {}) && (data = data[e]));
    data[last] = val;
    return data 
  }
  

  emitChange(state) {
    var timestamp = Math.floor(new Date().getTime() / 1000);
    var data = {"routing": "outgoing", "source" : this.widgetConf.uuid, "time": timestamp, data: {}};
    this.setJsonObject(data, this.widgetConf.config.datasource, state);
    this.eventBroker.handleIncommingMessage(data);
  }

  feedData(data) {
    const nestedProp = (obj, path) => path.split('.').reduce((obj, prop) => obj[prop], obj);
    let newData = nestedProp(data,this.widgetConf.config.datasource);
    if( typeof newData !== 'undefined' ) {
      $('#' + this.widgetConf.uuid).find("input").prop('checked', newData );
    }
  }

}

