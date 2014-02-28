// Globals
var lineBuffer = [];
var lineBufferLength;
var currentIndex = 0;
var init = 0;
var isIE = false; // this is needed to do a parser hack in IE

// UI elements
var debugWindow; // this window is "owned" by the debug client app
var debugTextDiv;
var showHideButton; // this button is added to the debug window by the debugging subsystem

function debugLog(line)
{
    lineBuffer[currentIndex] = line;
    currentIndex = (currentIndex + 1) % lineBufferLength;
    flushBuffer();
}

function debugLogInit(idWindow, numLinesInOutput)
{    
    var i;
    
    lineBufferLength = numLinesInOutput;
    // Find the debug window in the document and store a reference
    debugWindow = document.getElementById(idWindow);
    // initial index of the circular array
    currentIndex = 0;
    
/*
    var buttonDiv = document.createElement("div");
    buttonDiv.style.position = "absolute";
    buttonDiv.style.top = "0";
    buttonDiv.style.right = "0";
         
    buttonDiv.id = "buttonDiv";
    debugWindow.appendChild(buttonDiv);
    
    // Set up the show/hide button
    showHideButton = document.createElement("button");
    showHideButton.value = "Show/Hide"; // default to "hide"
    showHideButton.style.width = "100px";
    showHideButton.style.height = "30px";
    showHideButton.addEventListener("click", onShowHideButtonClick);
    buttonDiv.appendChild(showHideButton);

  */ 
    debugTextDiv = document.createElement("div");
    debugWindow.appendChild(debugTextDiv);
    if (navigator.appName == "Microsoft Internet Explorer") {
		isIE = true;
	}
    debugLog("DebugLog v1.0 Sponsored by border-radius");
}

function onShowHideButtonClick()
{
    debugLog("show hide clicked");
}

function flushBuffer()
{
    var i;
    var inOrder = [];
    var html = "";
    for (i = 0; i < lineBufferLength; i++) {
        var line = lineBuffer[(currentIndex + i) % lineBufferLength];
        
        if (line != undefined) {
            inOrder.push(line);
        }
    }
    inOrder.reverse();
    for (i = 0; i < inOrder.length; i++) {
		if (isIE) {
			html = html + inOrder[i] + "\n";		
		}
		else {
			html = html + inOrder[i] + "<br/>";
		}
    }
	if (isIE) {
		debugTextDiv.innerText = html;
	}
	else {
		debugTextDiv.innerHTML = html;
	}
}


