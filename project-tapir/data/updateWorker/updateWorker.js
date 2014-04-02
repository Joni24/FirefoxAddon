// traverse the dom and find the desired h tags, uses the jquery library

$(document).ready(function(){
	headings = $("h2");
	
	if(headings.length != 0)
	{
		var submitArray = new Array();
		headings.each(function( index ){
			submitArray.push($(this).text());
		})
		
		
		// for (var i in headings) {
			// submitArray.push(headings[i].text().toString());
		// }
		
		self.postMessage(submitArray);
	}
	else
		self.postMessage("keine h3s gefunden! :(");
});
