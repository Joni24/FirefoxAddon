// import all needed high level APIs
var widgets = require('sdk/widget');
var data = require('sdk/self').data;
var tabs = require("sdk/tabs");
var panels = require("sdk/panel");
var simpleStorage = require('sdk/simple-storage');
var pageWorker = require("sdk/page-worker");
var timer = require("sdk/timers");

var iconState = true;
var reloadTime = 10000;
var url = "https://dl.dropboxusercontent.com/u/2441646/myTestPage.html";

//////////////////////////////////////////////// my classes ////////////////////////////////////////////////

// Results, contains 
function Result(){
	this.url = "bla";
}

//////////////////////////////////////////////// my functions ///////////////////////////////////////////////

// changes the widget icon, responding to the number of new entrys
function bla(){
	iconState = !iconState;
	widget.contentURL = iconState ?
              data.url('widget/icon_1.png') :
              data.url('widget/icon_2.png');
};


// in this function a new page-worker is build, the pageWorker checks the url, and get destroyed after finishing
function update(){
	
	var worker = pageWorker.Page({
		contentScriptFile: [data.url('jquery-1.11.0.js'),
							data.url('updateWorker/updateWorker.js')],
		contentURL: url,
		onMessage: function(message) {
			console.log(message[0]);
			worker.destroy();
		}
	})
}


//////////////////////////////////////////////// "main" ////////////////////////////////////////////////

// create the main Widget
var widget = widgets.Widget({
	id: "main-widget",
	label: "ProjectTapir",
	contentURL: data.url('widget/icon_normal.png'),
	contentScriptFile: data.url('widget/clickHandler.js')
});

// listens for right- and left mouse click messages
widget.port.on('left-click', function() {
    console.log('left click');
	bla();
});

widget.port.on('right-click', function() {
	console.log('right click');
});

// set a timer, after the desired ms the function 
timer.setInterval(update, reloadTime);
// get an update now
update();




