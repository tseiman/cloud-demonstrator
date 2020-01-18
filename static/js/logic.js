console.log("Started Page");


// $('#passwdDialog').modal({backdrop: 'static', keyboard: false});


function constructWidgetList(widgetList) {

    widgetList.plugins.forEach(function (value, index, array) {
        //console.log(value);
        var html = `
            <button class="list-group-item d-flex justify-content-between align-items-center  list-group-item-action" name="${value.path}">
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
    });

    $('.list-group-item').on('click', function(event) {
        console.log('Clicked: ' + $(this).attr("name"));
      //  let that = this;
        $('#addWidget').attr("selectedwidget",$(this).attr("name"));
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

    socket = io('http://' + location.hostname + ':3002/', {
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

  //  socket.on('widgetList', (msg) => {
  //      console.log(`Got message`, msg);
  //      constructWidgetList(msg);
  //      error = null;
  //  });

  socket.open();
};
console.log("Try to connect socket.io");

connect();



$('#btn_passwdDialogClose').on('click', function(event) {
	connect($("#loginUsername").val(),$("#loginPassword").val());
    $("#passwdDialog").modal("hide");
});


$('.grid-stack').gridstack();



$('#btnAddWidget').on('click', function(event) {
    console.log(`Add widget trig'd`);
//    socket.emit('widgetList', {}); 
    $.getJSON( "/plugins.json", function( data ) {
        constructWidgetList(data);
    });

    $('#addWidget').attr("selectedwidget", "");
    $('#btnAddWidgetNext').attr("disabled", "");
    $('#addWidget').modal({});
});

$('#addWidget').on('hidden.bs.modal', function () {
     $('#addWidget').attr("selectedwidget", "");
     $("#widgetadd-list-group").empty();
});

$('#btnAddWidgetNext').on('click', function(event) {
     $('#addWidget').modal("hide");
     $('#confWidget').modal({});
});