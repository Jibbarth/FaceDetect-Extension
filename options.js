// Var declaration
var tLastInsert = (new Date()).getTime(); // to avoid multiple insertion
var tBetweenTwoInsert = 1500;
var iSensibility = 0.5;

vid = document.getElementById('videoel');
overlay = document.getElementById('overlay');
overlayCC = overlay.getContext('2d');

var bFocused = true;
var aPreviousEr = [];

window.onfocus = function() {
    bFocused = true;
};
window.onblur = function() {
    bFocused = false;
};
				
function smartInterval(func, interval){
    var last = new Date() - interval,
        now,
        numMissed;
    (function iterate(){
        func();
        // compute the number of iterations you might have missed
        // if you tabbed away and the interval was restricted to 1000ms
        now = +new Date();
        numMissed = Math.round((now - last) / interval) - 1;

        // make up for those iterations that were lost
        while (numMissed--) { func(); }

        last = +new Date();
        setTimeout(iterate, interval);
    })();
}
function enablestart() {
	startVideo();
}
				
				
/********** check and set up video/webcam **********/
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// check for camerasupport
if (navigator.getUserMedia) {
	// set up stream
					
	videoSelector = {video : true};
	if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
		chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
		if (chromeVersion < 20) {
			videoSelector = "video";
		}
	};
				
	navigator.getUserMedia(videoSelector, function( stream ) {
		vid.src = window.webkitURL.createObjectURL(stream);
		vid.play();
	}, function() {
		alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
	});
} else {
	//insertAltVideo(vid);
	alert("The extension depends on getUserMedia, which your browser does not seem to support. :(");
}

vid.addEventListener('canplay', enablestart, false);
				
/*********** setup of emotion detection *************/

ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);
				
ec = new emotionClassifier();
ec.init(emotionModel);
emotionData = ec.getBlank();	
				


function startVideo() {
	// start video
	vid.play();
	// start tracking
	ctrack.start(vid);
	// start loop to draw face
	drawLoop();
	smartInterval(function(){drawLoop();}, 100);

				}
function drawLoop() {
	overlayCC.clearRect(0, 0, 400, 300);
	//psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
	if (ctrack.getCurrentPosition()) {
		//disable for unactive tab perf
		if(bFocused){
			ctrack.draw(overlay);
		}
	}	
	var cp = ctrack.getCurrentParameters();
					
	var er = ec.meanPredict(cp);
	if (er) {
	//updateData(er);
		for (var i = 0;i < er.length;i++) {
			if(!bFocused){
				if(er[i].value == aPreviousEr[i].value){
					continue;
				}
			}
			if (er[i].value > iSensibility) {
				// Insert smiley here
				var sToInsert = "";
				switch(er[i].emotion){
					case 'happy':
						sToInsert = ' :)';
						break;

					case 'surprised':
						sToInsert = ' :O';
						break;
				}
				var tCurrentTime = (new Date()).getTime();
				if((tCurrentTime - tLastInsert) > tBetweenTwoInsert && sToInsert != ""){
					tLastInsert = tCurrentTime;
					console.log(sToInsert);
					// Send message to background.js
					chrome.runtime.sendMessage({"message": sToInsert, "mood":er[i].emotion});
				}
			}
		} // endfor
		aPreviousEr = er;
	}
}
