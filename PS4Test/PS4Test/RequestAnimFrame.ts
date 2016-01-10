
// See http://stackoverflow.com/questions/14716543/how-would-i-declare-a-monkey-patched-prototype-in-typescript

interface Window {
  requestAnimFrame(callback: any, element?: any): void;
  webkitRequestAnimationFrame(callback: any, element?: any): void;
  mozRequestAnimationFrame(callback: any, element?: any): void;
  oRequestAnimationFrame(callback: any, element?: any): void;
}

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element?) {
      window.setTimeout(callback, 1000 / 60);
    };
})();
