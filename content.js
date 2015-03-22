// content.js
chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
   	if(request.mood){
   		// Display message in active textarea.
   		if(document.activeElement.tagName == "TEXTAREA"){
	   		document.activeElement.textContent += request.message; 
   		}
   	}
  }
);