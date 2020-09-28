export default class {

 

  constructor(widgetConf,globalWidgetList) {
    this.widgetConf = widgetConf; 
    this.debug = false;

    if(new URLSearchParams(window.location.search).get('pluginStringFieldDEBUG') === 'true') {  // append  ?...&pluginStringFieldDEBUG=true to the URL to get debug outut from this module
        console.log("Plugin StringField debug enabled");
        this.debug = true;
    }

    var  isNewWidgetAndNotUpdated =  (globalWidgetList[widgetConf.uuid] == null);



    
    if(this.debug) {  console.log("new StringFiled generator with conf: ", widgetConf); }

  //  var grid = $('.grid-stack').data('gridstack');
//console.log(grid);

//    grid.addWidget(jQuery('<div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2" style="background-color: #ff8d7f;"><h1>oooooooo</h1></div>'),1, 1, 4, 1, true);



    $.get('/plugin/' + widgetConf.pluginToAdd + '/template.ejs', function (template) {
        // Compile the EJS template.
        this.func = ejs.compile(template);
        this.options = widgetConf.config;
        this.options.uuid = widgetConf.uuid;
        this.html = this.func({data: this.options});


        let grid = $('.grid-stack').data('gridstack');

        this.widgetX      = 0;
        this.widgetY      = 0;
        this.widgetWidth  = 3;
        this.widgetHeight = 2;


        if( widgetConf.geometry != null) {
          if( widgetConf.geometry.x != null)      { this.widgetX = widgetConf.geometry.x; }
          if( widgetConf.geometry.y != null)      { this.widgetY = widgetConf.geometry.y; }
          if( widgetConf.geometry.width != null)  { this.widgetWidth = widgetConf.geometry.width; }
          if( widgetConf.geometry.height != null) { this.widgetHeight = widgetConf.geometry.height; }

        }

        if(isNewWidgetAndNotUpdated) {
          this.widget = grid.addWidget(this.html, this.widgetX, this.widgetY, this.widgetWidth, this.widgetHeight , false, null, null, null, null, this.options.uuid);
        } else {

            $('#' + this.options.uuid).css('background-color',this.options.bgColor); 
            $('#' + this.options.uuid).find('.grid-stack-item-content').css('background-color',this.options.bgColor).css('color',this.options.color); 
            $('#' + this.options.uuid).find('.grid-stack-item-content').find('h5').text(this.options.caption);
        }
        if(this.debug) { console.log("Added new plugin:", this); }

    });


  }


  feedData(data) {
    const nestedProp = (obj, path) => path.split('.').reduce((obj, prop) => obj[prop], obj);

    let newData = nestedProp(data,this.widgetConf.config.datasource);

    if( typeof newData !== 'undefined' ) {
      $('#' + this.widgetConf.uuid).find("h1").text(newData +  this.widgetConf.config.unit);
    }
  }

}
// data.bgcolor  data.color  data.title 

