/**
 *Background script
 */

// On click on extension button, open option.html
chrome.browserAction.onClicked.addListener(function(tab) {
	var w_h = 1024;
	if(localStorage.faceDetectOptionOpened == 1){
		// This tab has been opened once. We can reduce it.
		w_h = 100;
	}
  chrome.windows.create({'url': chrome.extension.getURL('option.html'),'type' : 'popup','width': w_h,'height': w_h}, function(tab) {
  	createdTabId = tab.tabs[0].id;
  	localStorage.faceDetectOptionOpened = 1;
  });
});


// When background receive message from option page, send message to active tab.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    var activeTab = tabs[0];
		    console.log(request.message);
		    chrome.tabs.sendMessage(activeTab.id, {"message": request.message, "mood": request.mood});
		});
    }
);
