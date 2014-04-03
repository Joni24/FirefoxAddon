// show all new headlines in the Panel

self.on("message", function onMessage(unreadHeadlines) {
	var headlineList = $('#headline-list'); // element where all headlines are appended
	headlineList.empty();
	
	unreadHeadlines.forEach( function(headline) {
		var headlineHtml = $('#template .headline').clone();
		//headlineHtml.find(".headline-text").text(headline);
		headlineHtml.find(".url").text(headline);
		headlineHtml.find(".url").attr("href", "http://www.allgamesbeta.com/");
		headlineHtml.find(".url").bind("click", function(event){
			event.stopPropagation();
			event.preventDefault();
			
			// send a message to the add-on code to open this url and delete this headline
			self.postMessage("http://www.allgamesbeta.com/");
		});
		
		headlineList.append(headlineHtml);
	});

	

      // var annotationHtml = $('#template .annotation-details').clone();
      // annotationHtml.find('.url').text(storedAnnotation.url)
                                 // .attr('href', storedAnnotation.url);
      // annotationHtml.find('.url').bind('click', function(event) {
        // event.stopPropagation();
        // event.preventDefault();
        // self.postMessage(storedAnnotation.url);
      // });
      // annotationHtml.find('.selection-text')
                    // .text(storedAnnotation.anchorText);
      // annotationHtml.find('.annotation-text')
                    // .text(storedAnnotation.annotationText);
      // annotationList.append(annotationHtml);
   
});