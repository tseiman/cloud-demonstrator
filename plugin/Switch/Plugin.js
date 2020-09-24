export default class {

 

  constructor(widgetConf,globalWidgetList) {
    this.widgetConf = widgetConf; 
    var  isNewWidgetAndNotUpdated =  (globalWidgetList[widgetConf.uuid] == null);



    
    console.log("new Switch generator with conf: ", widgetConf);




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

    });


  }


  feedData(data) {
  //  console.log("feed data to switch", data);
/*    const nestedProp = (obj, path) => path.split('.').reduce((obj, prop) => obj[prop], obj);

    let newData = nestedProp(data,this.widgetConf.config.datasource);

    if( typeof newData !== 'undefined' ) {
//      $('#' + this.widgetConf.uuid).find("h1").text(newData +  this.widgetConf.config.unit);
      var tmpGauge = $("#gaugeCanvas-" + this.widgetConf.uuid).data('gauge');
      tmpGauge.set(newData);
    }
*/
  }

}
// data.bgcolor  data.color  data.title 

