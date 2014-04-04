// show all new headlines in the Panel

self.on("message", function onMessage(unreadHeadlines) {
	var headlineList = $('#headline-list'); // element where all headlines are appended
	headlineList.empty();
	
		
	unreadHeadlines.forEach( function(headline) {
		var headlineHtml = $('#template .headline').clone();
		headlineHtml.find(".url").text("\u2022 "+headline.text);
		headlineHtml.find(".url").attr("href", headline.url);
		
		// bind mousedown listener to element
		headlineHtml.find(".url").bind("mousedown", function(event){
			event.stopPropagation();
			event.preventDefault();
			
			var showInNewTab = true;
			if(event.which == 3) // right mouse button pressed)
				showInNewTab = false;
				
			// send a message to the add-on code to open this url, delete and hide this headline
			self.postMessage( [headline, showInNewTab, false] );
			$(this).remove();
		});
		
		headlineList.append(headlineHtml);
	});
   
   $("button").click(function(){
		headlineList.empty();
		self.postMessage( [null, null, true] );
   })
});