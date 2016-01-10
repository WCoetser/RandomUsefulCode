/// <reference path="intervalexecutionqueue.ts" />
/// <reference path="requestanimframe.ts" />
var firstRun = true;
var inInputTest = false;
var c;
var startDate = TimeToMilliseconds(new Date());
var animationRunningRequestAnimFrame = false;
var animationRunningSetInterval = false;
function WriteOutput(strOut) {
    var div = document.querySelector("#divOut");
    var newElement = document.createElement("div");
    if (strOut) {
        newElement.innerHTML = strOut;
    }
    else {
        newElement.innerHTML = "&nbsp;";
    }
    // Prevent "input gaps" due to dynamically added elements
    HookEventsTest(newElement);
    div.appendChild(newElement);
}
function Draw() {
    // Based on http://www.html5canvastutorials.com/tutorials/html5-canvas-circles/
    var context = c.getContext('2d');
    var centerX = c.width / 2;
    var centerY = c.height / 2;
    var dt = startDate - TimeToMilliseconds(new Date());
    var dy = Math.sin(dt / 500.0) * 80.0;
    var dx = Math.cos(dt / 500.0) * 80.0;
    context.clearRect(0, 0, c.width, c.height);
    context.beginPath();
    context.arc(centerX + dx, centerY + dy, 70.0, 0, 2 * Math.PI, false);
    if (animationRunningSetInterval)
        context.fillStyle = 'green';
    else
        context.fillStyle = 'red';
    context.fill();
    context.lineWidth = 5;
    if (animationRunningSetInterval)
        context.strokeStyle = '#003300';
    else
        context.strokeStyle = '#330000';
    context.stroke();
}
function RenderTimeOut() {
    if (!animationRunningSetInterval)
        return;
    Draw();
    setTimeout(RenderTimeOut, 1);
}
function RenderRequestAnimFrame() {
    if (!animationRunningRequestAnimFrame)
        return;
    Draw();
    window.requestAnimationFrame(RenderRequestAnimFrame);
}
function ClearOutput() {
    var div = document.querySelector("#divOut");
    div.innerHTML = "";
}
function CanvasTest(requestAnimFrame) {
    ClearOutput();
    var div = document.querySelector("#divOut");
    c = document.createElement("canvas");
    c.width = 800;
    c.height = 600;
    c.style.border = "1px solid black";
    div.appendChild(c);
    if (requestAnimFrame)
        RenderRequestAnimFrame();
    else
        RenderTimeOut();
}
function SelectionChange(evt) {
    firstRun = true;
}
function GetSelection() {
    var rdbs = document.querySelectorAll("[name='rdbTest']");
    for (var i = 0; i < rdbs.length; i++) {
        var s = (rdbs.item(i));
        if (s.checked)
            return s.value;
    }
    return null;
}
function buttonClickListener(evt) {
    if (firstRun) {
        ClearOutput();
        firstRun = false;
    }
    inInputTest = false;
    var selected = GetSelection();
    animationRunningRequestAnimFrame = false;
    animationRunningSetInterval = false;
    switch (selected) {
        case "iterate": {
            IterateTest();
            break;
        }
        case "input": {
            InputTest();
            break;
        }
        case "canvasRequestAnim": {
            animationRunningRequestAnimFrame = true;
            CanvasTest(true);
            break;
        }
        case "canvasIterate": {
            animationRunningSetInterval = true;
            CanvasTest(false);
            break;
        }
    }
}
function InputTest() {
    WriteOutput("Running input test ... press buttons etc.");
    inInputTest = true;
}
function TimeToMilliseconds(dateTime) {
    var milliseconds;
    var seconds = 1000;
    var minutes = 60 * seconds;
    var hours = 60 * minutes;
    return (dateTime.getHours() * hours) + (dateTime.getMinutes() * minutes) + (dateTime.getSeconds() * seconds) + dateTime.getMilliseconds();
}
function IterateTest() {
    WriteOutput("** NOTE ** Running test 30 times ... stats at end");
    var numIterations = 50000000;
    WriteOutput("For-loop iterations: " + numIterations);
    WriteOutput("");
    var elapsedTimes = new Array();
    IntervalExecutionQueue.enqueueTask(function () { document.querySelector("#btnRun").disabled = true; });
    for (var j = 0; j < 30; j++) {
        IntervalExecutionQueue.enqueueTask(function () {
            var then = new Date();
            for (var i = 0; i < numIterations; i++) { }
            var now = new Date();
            WriteOutput("From: " + then);
            WriteOutput("To: " + now);
            var diff = TimeToMilliseconds(now) - TimeToMilliseconds(then);
            WriteOutput("Total milliseconds: " + diff);
            elapsedTimes.push(diff);
        });
        IntervalExecutionQueue.enqueueTask(function () { WriteOutput(""); });
    }
    IntervalExecutionQueue.enqueueTask(function () {
        var sum = 0;
        var sumOfSquares = 0;
        var squareOfSum = 0;
        var min = elapsedTimes[0];
        var max = elapsedTimes[0];
        elapsedTimes.forEach(function (t) { sum += t; });
        var mean = sum / elapsedTimes.length;
        elapsedTimes.forEach(function (t) { sumOfSquares += t * t; });
        squareOfSum = sum * sum;
        elapsedTimes.forEach(function (t) { if (t < min)
            min = t; });
        elapsedTimes.forEach(function (t) { if (t > max)
            max = t; });
        var stdDev = Math.sqrt(sumOfSquares - (squareOfSum / elapsedTimes.length)) / (elapsedTimes.length - 1);
        var meanConfInvervalDiff = 1.96 * (stdDev / Math.sqrt(elapsedTimes.length));
        WriteOutput("=== Stats ===");
        WriteOutput("samples: " + elapsedTimes.length);
        WriteOutput("mean: " + mean);
        WriteOutput("standard deviation: " + stdDev);
        WriteOutput("min: " + min);
        WriteOutput("max: " + max);
        WriteOutput("95% confidence interval of mean execution time: " + Math.round((mean - meanConfInvervalDiff) * 100) / 100 + " to " + Math.round((mean + meanConfInvervalDiff) * 100) / 100);
    });
    IntervalExecutionQueue.enqueueTask(function () { document.querySelector("#btnRun").disabled = false; });
}
function HookEventsTest(element) {
    element.addEventListener("keydown", function (ev) {
        if (inInputTest) {
            ClearOutput();
            WriteOutput("keydown: char = " + ev.char + " key = " + ev.key + " key code = " + ev.keyCode);
        }
    });
    element.addEventListener("keyup", function (ev) {
        if (inInputTest) {
            ClearOutput();
            WriteOutput("keyup: char = " + ev.char + " key = " + ev.key + " key code = " + ev.keyCode);
        }
    });
    element.addEventListener("mousedown", function (ev) {
        if (inInputTest) {
            ClearOutput();
            WriteOutput("mouse down: " + ev.button);
        }
    });
    element.addEventListener("mouseup", function (ev) {
        if (inInputTest) {
            ClearOutput();
            WriteOutput("mouse mouseup: " + ev.button);
        }
    });
    element.addEventListener("mousemove", function (ev) {
        if (inInputTest) {
            ClearOutput();
            WriteOutput("mouse move: page_x = " + ev.pageX + " page_y = " + ev.pageY);
        }
    });
    element.addEventListener("mousewheel", function (ev) {
        if (inInputTest) {
            ClearOutput();
            WriteOutput("mouse wheel detected");
        }
    });
}
// Thats what it says ...
function TryCatchDoNothing(f) {
    try {
        f();
    }
    catch (ex) { }
}
function PrintBrowserString() {
    WriteOutput("Information sent by the browser:");
    TryCatchDoNothing(function () {
        if (navigator.appCodeName) {
            WriteOutput("navigator.appCodeName = " + navigator.appCodeName);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.appMinorVersion) {
            WriteOutput("navigator.appMinorVersion = " + navigator.appMinorVersion);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.appName) {
            WriteOutput("navigator.appName = " + navigator.appName);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.appVersion) {
            WriteOutput("navigator.appVersion = " + navigator.appVersion);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.appName) {
            WriteOutput("navigator.appVersion = " + navigator.appName);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.browserLanguage) {
            WriteOutput("navigator.appVersion = " + navigator.browserLanguage);
        }
    });
    //if (navigator.connectionSpeed) {
    // WriteOutput("navigator.appVersion = " + navigator.connectionSpeed);
    //}
    TryCatchDoNothing(function () {
        if (navigator.cookieEnabled) {
            WriteOutput("navigator.appVersion = " + navigator.cookieEnabled);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.cpuClass) {
            WriteOutput("navigator.appVersion = " + navigator.cpuClass);
        }
    });
    //if (navigator.javaEnabled) {
    //    WriteOutput("navigator.geolocation = " + navigator.javaEnabled);
    //  }
    TryCatchDoNothing(function () {
        if (navigator.language) {
            WriteOutput("navigator.language = " + navigator.language);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.maxTouchPoints) {
            WriteOutput("navigator.maxTouchPoints = " + navigator.maxTouchPoints);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.mimeTypes) {
            var mimeTypes = "";
            for (var i = 0; i < navigator.mimeTypes.length; i++) {
                var t = navigator.mimeTypes[i];
                mimeTypes += " " + t.description + ", " + t.type;
            }
            WriteOutput("navigator.mimeTypes = " + mimeTypes);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.onLine) {
            WriteOutput("navigator.onLine = " + navigator.onLine);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.platform) {
            WriteOutput("navigator.platform = " + navigator.platform);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.pointerEnabled) {
            WriteOutput("navigator.pointerEnabled = " + navigator.pointerEnabled);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.product) {
            WriteOutput("navigator.product = " + navigator.product);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.systemLanguage) {
            WriteOutput("navigator.systemLanguage = " + navigator.systemLanguage);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.userAgent) {
            WriteOutput("navigator.userAgent = " + navigator.userAgent);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.userLanguage) {
            WriteOutput("navigator.userLanguage = " + navigator.userLanguage);
        }
    });
    TryCatchDoNothing(function () {
        if (navigator.vendor) {
            WriteOutput("navigator.vendor = " + navigator.vendor);
        }
    });
}
document.addEventListener("DOMContentLoaded", function (event) {
    var run = document.querySelector("#btnRun");
    run.addEventListener("click", buttonClickListener);
    var iterate = document.querySelector("#rdbTestIterate");
    var input = document.querySelector("#rdbTestInput");
    var canvas = document.querySelector("#rdbTestCanvas");
    iterate.addEventListener("click", SelectionChange);
    input.addEventListener("click", SelectionChange);
    canvas.addEventListener("click", SelectionChange);
    // Input test
    var body = document.querySelector("body");
    HookEventsTest(body);
    ClearOutput();
    PrintBrowserString();
    WriteOutput("");
    WriteOutput("Select input and click on Run");
    // Animation and for-loop
    IntervalExecutionQueue.start();
});
//# sourceMappingURL=AppMain.js.map