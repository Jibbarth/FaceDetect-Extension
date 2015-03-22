/**
 *Background script
 */

// On click on extension button, open option.html
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('option.html')}, function(tab) {
  	createdTabId = tab.id;
  });
});


// When background receive message from option page, send message to active tab.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    	console.log(request.message);
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    var activeTab = tabs[0];
		    console.log(activeTab);
		    chrome.tabs.sendMessage(activeTab.id, {"message": request.message, "mood": request.mood});
		});
    }
);
