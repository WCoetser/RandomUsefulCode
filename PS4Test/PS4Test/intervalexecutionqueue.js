/// <reference path="intervalexecutionstates.ts" />
var IntervalExecutionQueue = (function () {
    function IntervalExecutionQueue() {
    }
    IntervalExecutionQueue.enqueueTask = function (task) {
        IntervalExecutionQueue.taskList.push(task);
    };
    IntervalExecutionQueue.dequeueTask = function () {
        return IntervalExecutionQueue.taskList.shift();
    };
    IntervalExecutionQueue.start = function () {
        IntervalExecutionQueue.intervalId = setInterval(IntervalExecutionQueue.processLoop, IntervalExecutionQueue.intervalLength);
    };
    IntervalExecutionQueue.processLoop = function () {
        if (IntervalExecutionQueue.currentState != IntervalExecutionState.Ready)
            return;
        IntervalExecutionQueue.currentState = IntervalExecutionState.Processing;
        var nextTask = IntervalExecutionQueue.dequeueTask();
        if (nextTask) {
            try {
                nextTask();
            }
            catch (ex) {
                WriteOutput("ERROR: " + ex.toString());
            }
        }
        IntervalExecutionQueue.currentState = IntervalExecutionState.Ready;
    };
    IntervalExecutionQueue.taskList = new Array();
    IntervalExecutionQueue.intervalLength = 100;
    IntervalExecutionQueue.currentState = IntervalExecutionState.Ready;
    return IntervalExecutionQueue;
})();
//# sourceMappingURL=intervalexecutionqueue.js.map