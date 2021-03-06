export default class {

 

  constructor(widgetConf,globalWidgetList) {
    this.widgetConf = widgetConf; 
    var  isNewWidgetAndNotUpdated =  (globalWidgetList[widgetConf.uuid] == null);

    this.debug = false;
    if(new URLSearchParams(window.location.search).get('pluginGaugeDEBUG') === 'true') {  // append  ?...&pluginStringFieldDEBUG=true to the URL to get debug outut from this module
        console.log("Plugin Gauge debug enabled");
        this.debug = true;
    }

    
    if(this.debug) { console.log("new Gauge generator with conf: ", widgetConf); }

  //  var grid = $('.grid-stack').data('gridstack');
//console.log(grid);

//    grid.addWidget(jQuery('<div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2" style="background-color: #ff8d7f;"><h1>oooooooo</h1></div>'),1, 1, 4, 1, true);



    $.get('/plugin/' + widgetConf.pluginToAdd + '/template.ejs', function (template) {
        // Compile the EJS template.
        this.func = ejs.compile(template);
        this.options = widgetConf.config;
        this.options.uuid = widgetConf.uuid;
        this.options.strSegments = JSON.stringify(widgetConf.config.segment);
 //       console.log("Gauge generator options: ", this.options);
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

    });


  }


  feedData(data) {
    const nestedProp = (obj, path) => path.split('.').reduce((obj, prop) => obj[prop], obj);

    let newData = nestedProp(data,this.widgetConf.config.datasource);

    if( typeof newData !== 'undefined' ) {
//      $('#' + this.widgetConf.uuid).find("h1").text(newData +  this.widgetConf.config.unit);
      var tmpGauge = $("#gaugeCanvas-" + this.widgetConf.uuid).data('gauge');
      tmpGauge.set(newData);
    }
  }

}
// data.bgcolor  data.color  data.title 

