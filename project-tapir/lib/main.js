// import all needed high level APIs
var widgets = require('sdk/widget');
var data = require('sdk/self').data;
var tabs = require("sdk/tabs");
var panels = require("sdk/panel");
var simpleStorage = require('sdk/simple-storage');
var pageWorker = require("sdk/page-worker");

var iconState = true;
var reloadTime = 100;
var url = data.url('myTestPage.html');

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


// this page worker checks the url in a preset time intervall, a page-worker let you access a web page dom
var updateWorker = pageWorker.Page({
  contentScript: "console.log(document.body.innerHTML);",
  contentURL: url
});

//// my classes ////

//// my functions ////

// changes the widget icon, responding to the number of new entrys
function bla(){
	iconState = !iconState;
	widget.contentURL = iconState ?
              data.url('widget/icon_1.png') :
              data.url('widget/icon_2.png');
};