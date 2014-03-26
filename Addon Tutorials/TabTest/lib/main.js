// var tabs = require("sdk/tabs");
// tabs.open({
  // url: "http://www.allgamesbeta.com/",
  // onReady: runScript
// });
 
// function runScript(tab) {
  // tab.attach({
    // contentScript: "document.body.style.border = '5px solid red';"
  // });
// }

var tabs = require("sdk/tabs");
var widget = require("sdk/widget");
var panel = require("sdk/panel");
var data = require("sdk/self").data;

var tabString = "";

var show_panel = panel.Panel({
  width: 212,
  height: 200,
  contentURL: data.url("text-entry.html"),
  contentScriptFile: data.url("get-text.js")
});

widget.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: listTabs,
  panel: show_panel
});

 show_panel.on("show", function() {
  console.log(tabString);
  show_panel.port.emit("show", tabString);
}); 

function listTabs() {
  tabString = "";
  for each (var tab in tabs)
    tabString += tab.url + '\n';
}