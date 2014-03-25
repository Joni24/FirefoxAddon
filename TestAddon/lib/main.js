var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "https://dl.dropboxusercontent.com/u/2441646/project_tapir_icon.png",
  onClick: function() {
    tabs.open("http://www.mozilla.org/");
  }
});