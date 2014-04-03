// main addon-script which cares aubout storage and delegates tasks to the content-scripts

// import all needed high level APIs
var widgets = require('sdk/widget');
var data = require('sdk/self').data;
var tabs = require("sdk/tabs");
var panels = require("sdk/panel");
var simpleStorage = require('sdk/simple-storage');
var pageWorker = require("sdk/page-worker");
var timer = require("sdk/timers");
var prefsAccess = require('sdk/simple-prefs');

if(prefsAccess.prefs['maxHeadlines'] >= 100)
	prefsAccess.prefs['maxHeadlines'] = 100;
	
var maxHeadlines = prefsAccess.prefs['maxHeadlines'];


var iconState = true;
var reloadTime = 600000; // 600000 = 10min
//var url = "https://dl.dropboxusercontent.com/u/2441646/myTestPage.html";
var url = "http://www.allgamesbeta.com/";

// create the persistent unreadHeadlines array at first start
if (!simpleStorage.storage.unreadHeadlines)
	simpleStorage.storage.unreadHeadlines = [];
  
simpleStorage.storage.unreadHeadlines.push("1"); 
simpleStorage.storage.unreadHeadlines.push("2"); 
simpleStorage.storage.unreadHeadlines.push("3");
// simpleStorage.storage.unreadHeadlines.push(maxHeadlines); 
  
// if (simpleStorage.storage.notFirstRun == null)
	// simpleStorage.storage.notFirstRun = false;
	
if (!simpleStorage.storage.lastHeadline)
	simpleStorage.storage.lastHeadline = null;
	
// Panel wich shows the new headlines
var headlinesPanel = panels.Panel({
	width: 420,
	height: 200,
	contentURL: data.url('headlinesPanel/headlinesPanel.html'),
	contentScriptFile: [data.url('jquery-1.11.0.js'),
					    data.url('headlinesPanel/headlinesPanel.js')],
	contentScriptWhen: 'ready',
	onShow: function() {
		// send the headlines to the content script to display them
		this.postMessage(simpleStorage.storage.unreadHeadlines);
	},
	onMessage: function(message){
		tabs.open(message);
	}
});

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
	console.log("-> update "+ new Date());
	
	var worker = pageWorker.Page({
		contentScriptWhen: 'ready',
		contentScriptFile: [data.url('jquery-1.11.0.js'),
							data.url('updateWorker/updateWorker.js')],
		contentURL: url,
		onMessage: function(message) {
			if(message != "")
			{
				//console.log(message[0]);
				checkForNewHeadlines(message);
			}
			else
				console.log("Kein Element gefunden");
			
			worker.destroy();
		}
	})
}

// check if the first headline (the highest in the html file) is already cached
function checkForNewHeadlines(headlineCandidates){
	console.log("currentH: "+simpleStorage.storage.lastHeadline+"->   new candidate: "+ headlineCandidates[0]);
	
	if(simpleStorage.storage.lastHeadline == null)
	{
		// just save the newest Headline
		simpleStorage.storage.lastHeadline = headlineCandidates[0];
	}
	else{
		
		for (var i=0; i < headlineCandidates.length; i++)
		{
			if( headlineCandidates[i] != simpleStorage.storage.lastHeadline )
			{
				// add headlines at front of the array
				simpleStorage.storage.unreadHeadlines.splice(i, 0, headlineCandidates[i]);
			}
			else
			{
				break;
			}
			
		}
		
		if(simpleStorage.storage.unreadHeadlines != null)
		{
			simpleStorage.storage.lastHeadline = headlineCandidates[0];
		}
	}
	
	
	// else if(simpleStorage.storage.lastHeadline != headlineCandidates[0])
	// {	
		// // 
		// var tmpLastHeadline = simpleStorage.storage.lastHeadline;
		// var tmpUnreadHeadlines = simpleStorage.storage.unreadHeadlines;
		
		// //delete simpleStorage.storage.unreadHeadlines;
		// simpleStorage.storage.unreadHeadlines = [];
		
		// for (var i=0; i < headlineCandidates.length; i++)
		// {
			// if(headlineCandidates[i] == tmpLastHeadline || i > maxHeadlines)
				// break;
			// else
			// {
				// simpleStorage.storage.unreadHeadlines.push(headlineCandidates[i]);
			// }
		// }
		
		// simpleStorage.storage.lastHeadline = headlineCandidates[0];
	// }
	
	console.log("Unread Headlines: "+simpleStorage.storage.unreadHeadlines);
}


//////////////////////////////////////////////// "main" ////////////////////////////////////////////////

// create the main Widget
var widget = widgets.Widget({
	id: "main-widget",
	label: "ProjectTapir",
	contentURL: data.url('widget/icon_normal.png'),
	contentScriptFile: data.url('widget/clickHandler.js'),
	panel: headlinesPanel
});

// listens for right- and left mouse click messages
widget.port.on('left-click', function() {
    console.log('left click');
	headlinesPanel.show();
});

widget.port.on('right-click', function() {
	console.log('right click');
	bla();
});

// set a timer, after the desired ms the function 
timer.setInterval(update, reloadTime);
// get an update now
update();




