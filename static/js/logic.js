import NewWidget from "./NewWidget.js";
import ClientEventBroker from "./ClientEventBroker.js";

console.log("Started Page");

// $('#passwdDialog').modal({backdrop: 'static', keyboard: false});
window.newWidget = null;




window.globalWidgetList = {};
window.globalClientList = {};


//const clientEventBroker = new ClientEventBroker(globalWidgetList,registerNewClientID);

const clientEventBroker = new ClientEventBroker(registerNewClientID);

function registerNewClientID(clientID) {

    if(!(clientID in window.globalClientList)) {
        window.globalClientList[clientID] = clientID;
        $('#clientIdSelector').append(`
                <button type="button" class="dropdown-item dropdown-item-clientid" name="${clientID}">${clientID}</button>
        `);
        $('.dropdown-item-clientid').on('click', function(event) {
            $('#clientIdSelectorButton').text($(this).attr('name'));
            clientEventBroker.setFilter($(this).attr('name'));
        });

    }

}



function constructWidgetList(widgetList) {

    console.log("Called constructWidgetList");

    widgetList.plugins.forEach(function (value, index, array) {
//        console.log(value.defaultconfig);
        var html = `
            <button class="list-group-item d-flex justify-content-between align-items-center  list-group-item-action" name="${value.path}" id="btnPluginSelect-${value.path}">
                <div class="widgetadd-image-parent">
                    <img src="/plugin/${value.path}/icon.png" class="img-fluid" alt="${value.path}">
                </div>
                <div class="widgetadd-grouphead-div">
                    <h5 class="grouphead"> ${value.name}</h5>
                    ${value.description}, Version:  ${value.version}
                <div>
            </button>
        `;
        $("#widgetadd-list-group").append(html);
        $("#btnPluginSelect-" + value.path).data('defaultconfig',value.defaultconfig);

    });

    $('.list-group-item').on('click', function(event) {
        console.log('Clicked: ' + $(this).attr("name"));
        $(this).parent().find('button').removeClass('active');
        $(this).addClass('active');

        window.newWidget = new NewWidget($(this).attr("name"),null,$("#btnPluginSelect-" + $(this).attr("name")).data('defaultconfig') ,null);

        $('#btnAddWidgetNext').removeAttr('disabled');
    });

}

$('#passwdDialog').on('shown.bs.modal', function () {
    $('#loginUsername').focus();
});


$('.inputs').keydown(function (e) {
    if (e.which === 13) {
        var index = $('.inputs').index(this) + 1;
        $('.inputs').eq(index).focus();
    }
});

const connect = (username, password) => {
let error = null;
    
    var socket = io('http://' + location.hostname + ':3002/', {
        autoConnect: false,
    });

    socket.on('connect', () => {
        console.log('Connected');

        socket.emit('authentication', {username: username, password: password}); 
    });

    socket.on('unauthorized', (reason) => {
        console.log('Unauthorized:', reason);
        error = reason.message;
        socket.disconnect();
        console.log('show modal');

//    setTimeout(function(){$('#passwdDialog').modal('show')}, 100); 

    });

    socket.on('disconnect', (reason) => {
        console.log(`Disconnected: ${error || reason}`);
        error = null;
    });

    socket.on('pushMessage', (msg) => {
        clientEventBroker.handleIncommingMessage(msg);
        error = null;
    });

  socket.open();
};
console.log("Try to connect socket.io");

connect();



$('#btn_passwdDialogClose').on('click', function(event) {
	connect($("#loginUsername").val(),$("#loginPassword").val());
    $("#passwdDialog").modal("hide");
});


$('.grid-stack').gridstack({
    disableDrag: false,
    removable: '#btnTrashWidget',
    removeTimeout: 100
});

$('.grid-stack').on('change', function(event, items) {
    items.forEach(function (item, index) {
        window.globalWidgetList[item.id].geometry = { "x": item.x, "y": item.y, "width": item.width, "height": item.height };
    });
});
$('.grid-stack').on('added', function(event, items) {
    items.forEach(function (item, index) {
        window.globalWidgetList[item.id].geometry = { "x": item.x, "y": item.y, "width": item.width, "height": item.height };
    });
});
$('.grid-stack').on('removed', function(event, items) {
    console.log("removed", items);
    items.forEach(function (item, index) {
//        window.globalWidgetList[item.id].geometry = { "x": item.x, "y": item.y, "width": item.width, "height": item.height };
        delete window.globalWidgetList[item.id];
    });

});

$('#btnAddWidget').on('click', function(event) {
    console.log("Add widget trig'd");
//    socket.emit('widgetList', {}); 
    $.getJSON( "/plugins.json", function( data ) {
        constructWidgetList(data);
    });

 //   $('#addWidget').attr("selectedwidget", "");
    $('#btnAddWidgetNext').attr("disabled", "");
    $('#addWidget').modal({});
});

$('#addWidget').on('hidden.bs.modal', function () {
  //   $('#addWidget').attr("selectedwidget", "");
     $("#widgetadd-list-group").empty();
});


function confWindowSetModalContent(options) {
    $.get('/plugin/' + window.newWidget.pluginToAdd + '/config.ejs', function (template) {
        // Compile the EJS template.
        console.log("config template options: ", options);
        let func = ejs.compile(template);
       // let options = { "dataSource" : { "value" : "", ok: "" }, "caption" : { "value" : "", ok: "" }, "bgcolor": { "value" : "#ffa887", ok: "" },  "color" : { "value" : "#202020", ok: "" },  "unit": { "value" : "", ok: "" }};
        let html = func(options);
        $( "#widgetconf-body" ).html(html);
          $('#confWidget').modal({});
    });
}

$('#btnAddWidgetNext').on('click', function(event) {
    $('#addWidget').modal("hide");
  //   $('#confWidget').modal({});
//    confWindowSetModalContent({  "uuid": "", "dataSource" : "", "caption" : "", "bgcolor" : "#ffa887",  "color" : "#202020", "unit": ""});
    confWindowSetModalContent(window.newWidget.config);
});

/*
$('#confWidget').on('show.bs.modal', function () {
    console.log("show confWidget");


});
*/

$('#btnConfWidgetNext').on('click', function(event) {
     $('#confWidget').modal("hide");

    (async () => {

        const {default: Plugin} = await import('../plugin/' + window.newWidget.pluginToAdd +  '/Plugin.js');
        window.newWidget.logic = new Plugin(window.newWidget,window.globalWidgetList);
         globalWidgetList[window.newWidget.uuid] = window.newWidget;

    })().catch(error => {
        // Handle/report error
        console.error(error);
    });

});



$(".fittableText").fitText(0.38);



function generateGlobalConfig() {
    var filteredWidgetList = {};
    for (var i = 0, keys = Object.keys(window.globalWidgetList), ii = keys.length; i < ii; i++) {
        filteredWidgetList[keys[i]] =  window.globalWidgetList[keys[i]];
        delete filteredWidgetList[keys[i]].logic;
    }
    return filteredWidgetList;
}

function saveChanges () {   
    var toSave = generateGlobalConfig();
    console.log("saving data", toSave);
//    alert("Saved Data");
    localStorage.setItem("cloud-demonstrator.globalConfig", JSON.stringify(toSave));
  //  window.onbeforeunload = null;
}

function exitConfirmation () {
    console.log("what we have:", window.globalWidgetList);
    setTimeout( saveChanges, 0 );
    return "There are unsaved changes on this canvas, all your changes will be lost if you exit !";
}

$('#btnSave').on('click', function(event) {
    saveChanges();

});



function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}



$('#btnDownload').on('click', function(event) {

    download('config.json',JSON.stringify(generateGlobalConfig(), null, 2),);
});



$('#btnUpload').on('click', function(event) {
    $('#uploadFileInput').click();

});

function loadConfig(jsonConfig) {
    window.newWidget = null;
    window.globalWidgetList = {};

    if(jsonConfig === null) { console.log("not loading config, localStorage.getItem was null or returned unparsable data"); return; }
    if(Object.keys(jsonConfig).length < 1) {console.log("not loading config, localStorage.getItem returned JSON which didn't contain a list of widgets", jsonConfig); return; }

    let grid = $('.grid-stack').data('gridstack');
    grid.removeAll();


    for (var i = 0, keys = Object.keys(jsonConfig), ii = keys.length; i < ii; i++) {
        var myNewWidget = new NewWidget(jsonConfig[keys[i]].plugin, jsonConfig[keys[i]].uuid, jsonConfig[keys[i]].config, jsonConfig[keys[i]].geometry);
        window.newWidget = myNewWidget;


        (async (myNewWidget) => {
            const {default: Plugin} = await import('../plugin/' + myNewWidget.pluginToAdd +  '/Plugin.js');
            myNewWidget.logic = new Plugin(myNewWidget,window.globalWidgetList);
             globalWidgetList[myNewWidget.uuid] = myNewWidget;

        })(myNewWidget).catch(error => {
            // Handle/report error
            console.error(error);
        });



    }    

}

$( document ).ready(function() {
    var savedConfig = JSON.parse(localStorage.getItem("cloud-demonstrator.globalConfig"));
    loadConfig(savedConfig);

    window.handleUploadFiles = function (files) {
        let f = files[0];
        let reader = new FileReader();

      // Closure to capture the file information.
         reader.onload = (function(theFile) {
             return function(e) {
          // Render thumbnail.
            let JsonObj = JSON.parse(e.target.result);
            loadConfig(JsonObj);
            console.log("loading config from file", JsonObj);
            };
         })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);         

    }


});

window.setToolIconToGridItems = function (gridStackItem) {
    let tmpRunningWidget = window.globalWidgetList[gridStackItem];
     window.newWidget =  new NewWidget(tmpRunningWidget.plugin, tmpRunningWidget.uuid, tmpRunningWidget.config, tmpRunningWidget.geometry);
    
//     console.log ("Add !!! gridStackItem-button", gridStackItem ) ;
//     $('<button id="' + gridStackItem +'-button" class="ui-icon ui-configure-button  ui-resizable-autohide"></button>').insertAfter($('#' + gridStackItem).find(".grid-stack-item-content"));
     
     $('#' + gridStackItem).append('<button id="' + gridStackItem +'-button" class="ui-icon ui-configure-button  ui-resizable-autohide"></button>');

    $('#' + gridStackItem).hover(
      function () {
        $(this).find(".ui-configure-button").show();
      }, 
      function () {
        $(this).find(".ui-configure-button").hide();
      }
    ); 

    $('#' + gridStackItem +'-button').on('click', function(event) {

        window.newWidget = window.globalWidgetList[gridStackItem];
        let runningConf = window.globalWidgetList[gridStackItem].config;
        let options = runningConf;
        options.uuid = gridStackItem;

        /* { 
            "uuid"       : gridStackItem,
            "dataSource" : runningConf.datasource, 
            "caption"    : runningConf.caption, 
            "bgcolor"    : runningConf.bgColor,  
            "color"      : runningConf.color,  
            "unit"       : runningConf.unit
        }; */
        console.log("options:",options);
        console.log("gridStackItem:",window.globalWidgetList[gridStackItem]);

        confWindowSetModalContent(options);

    });
}

