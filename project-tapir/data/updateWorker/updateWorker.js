// traverse the dom and find the desired h tags, uses the jquery library

$(document).ready(function(){
	headings = $("h3 a");
	
	if(headings.length != 0)
	{
		var submitArray = new Array();
		headings.each(function( index ){
			submitArray.push( [ $(this).text(), $(this).attr("href") ]);
		})
		
		self.postMessage(submitArray);
	}
	else
		 self.postMessage("");
});
