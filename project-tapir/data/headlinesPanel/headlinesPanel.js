// show all new headlines in the Panel

self.on("message", function onMessage(unreadHeadlines) {
	var headlineList = $('#headline-list'); // element where all headlines are appended
	headlineList.empty();
	
	var numElements = unreadHeadlines.length;
	
	unreadHeadlines.forEach( function(headline) {
		var headlineHtml = $('#template .headline').clone();
		//headlineHtml.find(".headline-text").text(headline);
		headlineHtml.find(".url").text("\u2022 "+headline.text);
		headlineHtml.find(".url").attr("href", headline.url);
		headlineHtml.find(".url").bind("click", function(event){
			event.stopPropagation();
			event.preventDefault();
			
			// send a message to the add-on code to open this url, delete and hide this headline
			self.postMessage(headline);
			$(this).remove();
		});
		
		headlineList.append(headlineHtml);
	});
   
   $("button").click(function(){
		// alert(numElements);
		$("button").attr("disabled", "disabled");
   })
   
   // // enable clear all button
   // if(unreadHeadlines.length == 0);
		// $("button").attr("disabled", "disabled");
});