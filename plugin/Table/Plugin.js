'use strict';

export default class {

 

  constructor(widgetConf,globalWidgetList) {
    this.widgetConf = widgetConf; 
    this.options = null;
    this.substitutebykey = null;
   // this.valuelookup = {};
   // this.lastentry = 0;
    this.funcDeleteRule = null;
    this.funcColorRule = null;
    this.colIndexGetColNameByIndex = [];
    this.nestedProp = (obj, path) => path.split('.').reduce((obj, prop) => obj[prop], obj);


    this.debug = false;
    if(new URLSearchParams(window.location.search).get('pluginSwitchDEBUG') === 'true') {  // append  ?...&pluginLineChartDEBUG=true to the URL to get debug outut from this module
        console.log("Plugin Table debug enabled");
        this.debug = true;
    }


    var  isNewWidgetAndNotUpdated =  (globalWidgetList[widgetConf.uuid] == null);

    if(this.debug) { console.log("new Table generator with conf: ", widgetConf); } 



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
        that.widgetWidth  = 8;
        that.widgetHeight = 6;


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

        if(that.options.substitutebykey !== "") {
          that.substitutebykey = parseInt(that.options.substitutebykey) - 1;
        } else {
          that.substitutebykey = null;
        }

        if(that.options.deleterule !== "") {
          var rule = window.atob(that.options.deleterule);   
          try {
            that.funcDeleteRule = new Function('data','"use strict";' + rule);
          } catch (e) {
            console.warn("failed to create delete rule with error/rule: ", e,  rule);
          } 
        }

        if(that.options.colorrule !== "") {
          var rule = window.atob(that.options.colorrule);
          try {
            that.funcColorRule = new Function('data','"use strict";' + rule);
          } catch (e) {
            console.warn("failed to create color rule with error/rule: ", e,  rule);
          } 
        }

        for(var i = 0; i < that.options.col.length ; i++) {
          that.colIndexGetColNameByIndex.push(that.options.col[i].datasource);
        }


    });


  }




  getRowColor(row, index) {
    if(this.substitutebykey != null) {
      return {
        css: {
          'background-color': this.funcColorRule(row)
        }
      } 
    } else {
      return {
        css: {
          'fake-no-color': 'white'
        }
      }
    }
  }


  feedData(data) {
   
    // var tmpTable = $("#table-" + this.widgetConf.uuid);

    var newDataSet = {};
    var newDataSetIndex = [];



    if(this.funcDeleteRule != null) {

      var toDel = this.funcDeleteRule(data);
      if(typeof toDel === 'undefined') { 
        console.log("this was a delete command - but no result in looking up key data -> no action");
        return; 
      } 
      if(toDel != null) { 
     //   console.log(" delete mode0 ? ", this.valuelookup[toDel]);

        $("#table-" + this.widgetConf.uuid).bootstrapTable('removeByUniqueId', toDel);
    //    console.log(" delete mode1 ? ", this.valuelookup);
    //    delete this.valuelookup[toDel];
      //  console.log(" delete mode2 ? ", this.valuelookup);
        
        return;
      } 

      
    }

    for(var i = 0; i < this.options.col.length ; i++) {
      let newData = this.nestedProp(data,this.options.col[i].datasource);
      if((typeof newData === 'undefined') && this.options.col[i].mandatory) {  
        return;     // if there is a mandatory field which was not seen in the message we ignore the complete message
      }
    }



    for(var i = 0; i < this.options.col.length ; i++) {
      let newData = this.nestedProp(data,this.options.col[i].datasource);
      newDataSet[this.options.col[i].datasource] = newData;
      newDataSetIndex.push(newData);
    }



// console.log(" substitution mode ? ", this.substitutebykey,this.valuelookup,newDataSetIndex[this.substitutebykey],this.valuelookup);



  
    if(this.substitutebykey != null) {

/*
      if(newDataSetIndex[this.substitutebykey] in this.valuelookup) {
updateByUniqueId

         $("#table-" + this.widgetConf.uuid).bootstrapTable('updateRow',{index: this.valuelookup[newDataSetIndex[this.substitutebykey]], row: newDataSet} );
//         console.log("ubdating a  dataset in substitution mode",this.valuelookup[newDataSetIndex[this.substitutebykey]]);

      } else {
        this.valuelookup[newDataSetIndex[this.substitutebykey]] = this.lastentry;
        ++this.lastentry;
        console.log("entering a new dataset in substitution mode");
        $("#table-" + this.widgetConf.uuid).bootstrapTable('append', newDataSet);
      }
*/


    if($("#table-" + this.widgetConf.uuid).bootstrapTable('getRowByUniqueId', newDataSetIndex[this.substitutebykey]) != null) { 
      console.log("ubdating a  dataset in substitution mode");
         $("#table-" + this.widgetConf.uuid).bootstrapTable('updateByUniqueId',{'id': newDataSetIndex[this.substitutebykey], row: newDataSet} );
    } else {
        console.log("entering a new dataset in substitution mode");
        $("#table-" + this.widgetConf.uuid).bootstrapTable('append', newDataSet);      
    }

//this.options.col[this.substitutebykey -1].datasource
// console.log(newDataSetIndex[this.substitutebykey]);
      

    } else {
        console.log("append new dataset ");
      $("#table-" + this.widgetConf.uuid).bootstrapTable('append', newDataSet);
    }

  }

}
// data.bgcolor  data.color  data.title 

