/* Licence: GPL version 3, Wikus Coetser, 2013, http://www.gnu.org/licenses/gpl-3.0.html */

/*
  Function from MDN: This makes use requestAnimationFrame is availible.
*/
(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

/*
  Function for converting a RGBA encoded byte array to a bitmap image 
*/
function RGBAImageToDataUrl(bmpData, width, height) {
  if (!(bmpData instanceof Uint8Array)) throw "RGBAImageToDataUrl: Expected a Uint8Array data array as input";
  if (bmpData.length != width * height * 4) throw "Invalid image data, length must be " + (width * height * 4);

}

