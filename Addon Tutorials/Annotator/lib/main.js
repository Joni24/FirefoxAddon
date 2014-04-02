var widgets = require('sdk/widget');
var data = require('sdk/self').data;
var pageMod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
var panels = require("sdk/panel");
var simpleStorage = require('sdk/simple-storage');
var notifications = require("sdk/notifications");

if (!simpleStorage.storage.annotations)
  simpleStorage.storage.annotations = [];

var selectors = [];
var matchers = [];

var annotatorIsOn = false;

function updateMatchers() {
  matchers.forEach(function (matcher) {
    matcher.postMessage(simpleStorage.storage.annotations);
  });
}

function handleNewAnnotation(annotationText, anchor) {
  var newAnnotation = new Annotation(annotationText, anchor);
  simpleStorage.storage.annotations.push(newAnnotation);
  updateMatchers();
}

// Annotation Objekt
function Annotation(annotationText, anchor) {
  this.annotationText = annotationText;
  this.url = anchor[0];
  this.ancestorId = anchor[1];
  this.anchorText = anchor[2];
}

function activateSelectors() {
  selectors.forEach(
    function (selector) {
      selector.postMessage(annotatorIsOn);
  });
}

function toggleActivation() {
  annotatorIsOn = !annotatorIsOn;
  activateSelectors();
  return annotatorIsOn;
}

function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  };
}

// make the annotation panel
var annotationEditor = panels.Panel({
  width: 220,
  height: 220,
  contentURL: data.url('editor/annotation-editor.html'),
  contentScriptFile: data.url('editor/annotation-editor.js'),
  onMessage: function(annotationText) {
	if (annotationText)
		handleNewAnnotation(annotationText, this.annotationAnchor);
		
	annotationEditor.hide();
  },
  onShow: function() {
	this.postMessage('focus');
  }
});

var selector = pageMod.PageMod({
  include: ['*'],
  contentScriptWhen: 'ready',
  contentScriptFile: [data.url('jquery-1.11.0.js'),
                      data.url('selector.js')],
  onAttach: function(worker) {
    worker.postMessage(annotatorIsOn);
    selectors.push(worker);
    worker.port.on('show', function(data) {
      annotationEditor.annotationAnchor = data;
	  annotationEditor.bla = "---------------------------------------------------";
      annotationEditor.show();
    });
    worker.on('detach', function () {
      detachWorker(this, selectors);
    });
  }
});

// List-panel
var annotationList = panels.Panel({
  width: 420,
  height: 200,
  contentURL: data.url('list/annotation-list.html'),
  contentScriptFile: [data.url('jquery-1.11.0.js'),
                      data.url('list/annotation-list.js')],
  contentScriptWhen: 'ready',
  onShow: function() {
    this.postMessage(simpleStorage.storage.annotations);
  },
  onMessage: function(message) {
    tabs.open(message);
  }
});

// Annotation Panel
var annotation = panels.Panel({
  width: 200,
  height: 180,
  contentURL: data.url('annotation/annotation.html'),
  contentScriptFile: [data.url('jquery-1.11.0.js'),
                      data.url('annotation/annotation.js')],
  onShow: function() {
    this.postMessage(this.content);
  }
});

exports.main = function() {

  // set current url to testURL
  tabs.activeTab.url = "https://blog.mozilla.org/addons/2011/02/04/overview-amo-review-process/";
  // var widget_url = widgets.Widget({
    // id: 'test-url',
    // label: 'OpenTestURL',
    // contentURL: data.url('icon.png'),
	// onClick: function() {
        // tabs.activeTab.url = "https://blog.mozilla.org/addons/2011/02/04/overview-amo-review-process/";}
  // });

  var widget = widgets.Widget({
    id: 'toggle-switch',
    label: 'Annotator',
    contentURL: data.url('widget/pencil-off.png'),
    contentScriptWhen: 'ready',
    contentScriptFile: data.url('widget/widget.js')
  });

  widget.port.on('left-click', function() {
    console.log('activate/deactivate');
    widget.contentURL = toggleActivation() ?
              data.url('widget/pencil-on.png') :
              data.url('widget/pencil-off.png');
  });

  widget.port.on('right-click', function() {
      console.log('show annotation list');
	  annotationList.show();
  });
  
  simpleStorage.on("OverQuota", function () {
  notifications.notify({
    title: 'Storage space exceeded',
    text: 'Removing recent annotations'});
  while (simpleStorage.quotaUsage > 1)
    simpleStorage.storage.annotations.pop();
  });

  var matcher = pageMod.PageMod({
	  include: ['*'],
	  contentScriptWhen: 'ready',
	  contentScriptFile: [data.url('jquery-1.11.0.js'),
						  data.url('matcher.js')],
	  onAttach: function(worker) {
		if(simpleStorage.storage.annotations) {
		  worker.postMessage(simpleStorage.storage.annotations);
		}
		worker.port.on('show', function(data) {
		  annotation.content = data;
		  annotation.show();
		});
		worker.port.on('hide', function() {
		  annotation.content = null;
		  annotation.hide();
		});
		worker.on('detach', function () {
		  detachWorker(this, matchers);
		});
		matchers.push(worker);
	  }
  });
}