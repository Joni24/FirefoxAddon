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


var reloadTime = 10000; // 600000 = 10min
//var url = "https://dl.dropboxusercontent.com/u/2441646/myTestPage.html";
var url = "http://www.allgamesbeta.com/";


// create the persistent unreadHeadlines array at first start
if (!simpleStorage.storage.unreadHeadlines)
	simpleStorage.storage.unreadHeadlines = [];

  
// simpleStorage.storage.unreadHeadlines.push("1"); 
// simpleStorage.storage.unreadHeadlines.push("2"); 
// simpleStorage.storage.unreadHeadlines.push("3");
// simpleStorage.storage.unreadHeadlines.push(maxHeadlines); 
	
if (!simpleStorage.storage.lastHeadline)
	simpleStorage.storage.lastHeadline = new Headline( ["Mario Kart 8 New Courses & Items Trailer & Screens", "http://www.allgamesbeta.com/2014/04/mario-kart-8-new-courses-items-trailer.html"] );
	
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
	onMessage: function(headline){
		// open url in new tab
		tabs.open(headline.url);
		// delete from unreadHeadlines array
		// find index
		var findIndex = function(headline){
			for(var i=0; i < simpleStorage.storage.unreadHeadlines.length; i++) {
				if(simpleStorage.storage.unreadHeadlines[i].url == headline.url) {
					return i;
				}
			};
			return -1;
		};
		var index = findIndex(headline);
		if(index != -1)
		{
			console.log("delete :"+headline.text+" index: "+index);
			delete simpleStorage.storage.unreadHeadlines[index];
			simpleStorage.storage.unreadHeadlines.splice(index, 1);
			toggleImage();
		}
	}
});

//////////////////////////////////////////////// my classes ////////////////////////////////////////////////

// Results, contains 
function Headline(data){
	this.text = data[0];
	this.url = data[1];
}

//////////////////////////////////////////////// my functions ///////////////////////////////////////////////

// changes the widget icon, responding to the number of new entrys
function toggleImage(){
	if(simpleStorage.storage.unreadHeadlines == null || simpleStorage.storage.unreadHeadlines.length == 0 )
		widget.contentURL = data.url('widget/icon_normal.png');
	else if(simpleStorage.storage.unreadHeadlines.length > 9)
		widget.contentURL = data.url('widget/icon_many.png');
	else
		widget.contentURL = data.url("widget/icon_"+simpleStorage.storage.unreadHeadlines.length+".png");
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

	//console.log("currentH: "+simpleStorage.storage.lastHeadline+"->   new candidate: "+ headlineCandidates[0]);
	
	if(simpleStorage.storage.lastHeadline == null)
	{
		// just save the newest Headline
		simpleStorage.storage.lastHeadline = new Headline(headlineCandidates[0]);
	}
	else{
		
		for (var i=0; i < headlineCandidates.length; i++)
		{
			if( headlineCandidates[i][0] != simpleStorage.storage.lastHeadline.text )
			{
				// add headlines at front of the array
				simpleStorage.storage.unreadHeadlines.splice(i, 0, new Headline(headlineCandidates[i]));
			}
			else
			{
				break;
			}
			
		}
		
		if(simpleStorage.storage.unreadHeadlines != null)
		{
			simpleStorage.storage.lastHeadline = new Headline(headlineCandidates[0]);
		}
	}
	
	console.log("Unread Headlines: "+simpleStorage.storage.unreadHeadlines.toString());
	toggleImage();
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
	toggleImage();
});

// set a timer, after the desired ms the function 
timer.setInterval(update, reloadTime);
// get an update now
update();
toggleImage();



