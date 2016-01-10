/* Licence: GPL version 3, Wikus Coetser, 2013 */

/*
  Function from MDN: This makes use requestAnimationFrame is availible.
*/
(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
