const widgets = require("sdk/widget");
const data = require("sdk/self").data;


var player = widgets.Widget({
  id: "player",
  width: 72,
  label: "Player",
  contentURL: data.url("buttons.html"),
  contentScriptFile: data.url("button-script.js")
});


// A widget that changes display on mouseover.
/*
widgets.Widget({
  id: "mouseover-effect",
  label: "Widget with changing image on mouseover",
  contentURL: "http://www.yahoo.com/favicon.ico",
  onMouseover: function() {
    this.contentURL = "http://www.bing.com/favicon.ico";
  },
  onMouseout: function() {
    this.contentURL = "http://www.yahoo.com/favicon.ico";
  }
});
*/


// A widget that updates content on a timer.
/*
widgets.Widget({
  id: "auto-update-widget",
  label: "Widget that updates content on a timer",
  content: "0",
  contentScript: 'setTimeout(function() {' +
                 '  document.body.innerHTML++;' +
                 '}, 2000)',
  contentScriptWhen: "ready"
});
*/


// A widget created with a specified width, that grows.
/*
var myWidget = widgets.Widget({
  id: "widget-effect",
  label: "Wide widget that grows wider on a timer",
  content: "I'm getting longer.",
  width: 50,
});
require("sdk/timers").setInterval(function() {
  myWidget.width += 10;
}, 1000);
)*/


// A widget communicating bi-directionally with a content script.
/*
var widget = widgets.Widget({
  id: "message-test",
  label: "Bi-directional communication!",
  content: "<foo>bar</foo>",
  contentScriptWhen: "ready",
  contentScript: 'self.on("message", function(message) {' +
                 '  alert("Got message: " + message);' +
                 '});' +
                 'self.postMessage("ready");',
  onMessage: function(message) {
    if (message == "ready")
      widget.postMessage("me too");
  }
});
*/

player.port.on("play", function() {
  console.log("playing");
});
 
player.port.on("pause", function() {
  console.log("pausing");
});
 
player.port.on("stop", function() {
  console.log("stopping");
});