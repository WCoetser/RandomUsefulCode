/// <reference path="intervalexecutionstates.ts" />

class IntervalExecutionQueue {

  private static taskList: Array<() => void> = new Array <() => void>();
  private static intervalLength: number = 100;
  private static intervalId: number;
  private static currentState: IntervalExecutionState = IntervalExecutionState.Ready;

  static enqueueTask(task: () => void): void {
    IntervalExecutionQueue.taskList.push(task);
  }

  private static dequeueTask(): () => void {
    return IntervalExecutionQueue.taskList.shift();
  }

  static start() : void {
    IntervalExecutionQueue.intervalId = setInterval(IntervalExecutionQueue.processLoop, IntervalExecutionQueue.intervalLength);
  }

  private static processLoop(): void {
    if (IntervalExecutionQueue.currentState != IntervalExecutionState.Ready) return;
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
  }

}
