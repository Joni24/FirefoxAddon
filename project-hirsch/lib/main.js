var widgets = require("sdk/widget");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var prefs = require("sdk/preferences/service");
var data = self.data;

var helloPanel = require("sdk/panel").Panel({
    width:400,
    height:400,
    contentURL: "http://www.bostav.wordpress.com/"
});


widgets.Widget({
    id: "hirschi",
    label: "project hirsch",
    contentURL: self.data.url("images/icon.png"),
   /* onClick: function() {
        openTab("http://www.allgamesbeta.com?bla");
    },*/
    //contentScriptFile: self.data.url("click-listener.js")
    panel: helloPanel
        
});

widget.port.on("left-click", function(){
    console.log("left-click");
});
 
widget.port.on("right-click", function(){
    console.log("right-click");
});


function openTab(url){
    var refurl = addReferer(url);

    if(prefs.get("extensions.quicklaunch.tabsinbackground", true) === true )
        tabs.open({
            url: refurl,
            inBackground: true
        });
    else
        tabs.activeTab.url = url;
        
    //if(prefs.get('extensions.quicklaunch.consolelog', false) === true)
    console.log('Quick Launch :\t' + new Date() + '\n' + refurl);
}

function addReferer(url){
    var operator = (url.indexOf("?") === -1) ? "?" : "&";
    return url + operator + "ref=quicklaunch";
}
