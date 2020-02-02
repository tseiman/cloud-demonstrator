export default class {

 

  constructor(widgetConf,globalWidgetList) {
    this.widgetConf = widgetConf; 
    this.options = null;
    var  isNewWidgetAndNotUpdated =  (globalWidgetList[widgetConf.uuid] == null);



    
    console.log("new Line chart generator with conf: ", widgetConf);

  //  var grid = $('.grid-stack').data('gridstack');
//console.log(grid);

//    grid.addWidget(jQuery('<div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2" style="background-color: #ff8d7f;"><h1>oooooooo</h1></div>'),1, 1, 4, 1, true);

    Date.prototype.isValid = function () {
        // An invalid date object returns NaN for getTime() and NaN is the only
        // object not strictly equal to itself.
        return this.getTime() === this.getTime();
    };

    var that = this;

    $.get('/plugin/' + widgetConf.pluginToAdd + '/template.ejs', function (template) {
        // Compile the EJS template.
        var func = ejs.compile(template);
        that.options = widgetConf.config;
        that.options.uuid = widgetConf.uuid;
        that.options.strSegments = JSON.stringify(widgetConf.config.segment);
    //    console.log("Gauge generator options: ", this.options);
        that.html = func({data: that.options});


        let grid = $('.grid-stack').data('gridstack');

        that.widgetX      = 0;
        that.widgetY      = 0;
        that.widgetWidth  = 4;
        that.widgetHeight = 3;


        if( widgetConf.geometry != null) {
          if( widgetConf.geometry.x != null)      { that.widgetX = widgetConf.geometry.x; }
          if( widgetConf.geometry.y != null)      { that.widgetY = widgetConf.geometry.y; }
          if( widgetConf.geometry.width != null)  { that.widgetWidth = widgetConf.geometry.width; }
          if( widgetConf.geometry.height != null) { that.widgetHeight = widgetConf.geometry.height; }

        }

        if(isNewWidgetAndNotUpdated) {
          that.widget = grid.addWidget(that.html, that.widgetX, that.widgetY, that.widgetWidth, that.widgetHeight , false, null, null, null, null, that.options.uuid);
          window.setToolIconToGridItems(that.options.uuid);
        } else {
          let savedResizeBtn =  $('#' + that.options.uuid).find('.ui-resizable-handle');
          $('#' + that.options.uuid).empty();
          $('#' + that.options.uuid).html($(that.html).children() );
          $('#' + that.options.uuid).append(savedResizeBtn );

          window.setToolIconToGridItems(that.options.uuid);
        }

    });


  }

  feedData(data) {
    const nestedProp = (obj, path) => path.split('.').reduce((obj, prop) => obj[prop], obj);
    var tmpChart = $("#chartCanvas-" + this.widgetConf.uuid).data('chart');

    var isExeedingDataPoints = false;
    var maxDataPoints = parseInt(this.options.maxDataPoints);
    if(maxDataPoints > 0) {
      if(tmpChart.data.labels.length > maxDataPoints) {
        isExeedingDataPoints = true;
      }
    }


    if($("#confWidget").is(":visible")) {
      return;
    }

    var timeStamp = new Date();
    if(this.options.timesource !== "") {

      timeStamp = new Date(parseInt(nestedProp(data,this.options.timesource)) * 1000);

      if(!timeStamp.isValid()) {
        timeStamp = new Date();
        console.warn(`Timestamp with selector ${this.options.timesource} doesnt give valid timestamp ! - set timestamp to Now`);
      }

    }
    tmpChart.data.labels.push(timeStamp);
    if(isExeedingDataPoints) {
      tmpChart.data.labels.shift();
    }


    for(var i = 0; i < this.options.line.length ; i++) {
      let newData = nestedProp(data,this.options.line[i].datasource);
      if(typeof newData === 'undefined') { newData = null;}
      tmpChart.data.datasets[i].data.push(newData);
      if(isExeedingDataPoints) {
        tmpChart.data.datasets[i].data.shift();
      }
    }
    tmpChart.update();

  }

}
// data.bgcolor  data.color  data.title 

