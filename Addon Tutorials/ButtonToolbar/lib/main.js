var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var panel = require("sdk/panel");
var data = self.data;
 
var clockPanel = panel.Panel({
  width:215,
  height:160,
  contentURL: data.url("clock.html")
}); 
 
var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: self.data.url("mario&luigi.gif"),
  contentScriptFile: self.data.url("click-listener.js"),
  onMouseout : function() {
    console.log("Mouse out");
  },
  panel: clockPanel
});

widget.port.on("left-click", function(){
  console.log("left-click");
});

widget.port.on("right-click", function(){
  console.log("right-click");
});

widget.contentURL = self.data.url("yoshinoooi.gif")

