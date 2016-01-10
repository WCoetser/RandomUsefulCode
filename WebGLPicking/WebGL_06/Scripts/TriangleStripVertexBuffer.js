/* Licence: GPL version 3, Wikus Coetser, 2013, see http://www.gnu.org/licenses/gpl-3.0.html */

/*
  Class for managing triangle strip vertices.
*/
TriangleStripVertexBuffer = function (gl, shaders, modelViewMatrix, texture) {
  VertexBuffer.call(this, gl, shaders, modelViewMatrix, gl.TRIANGLE_STRIP, texture);
}
TriangleStripVertexBuffer.prototype = Object.create(VertexBuffer.prototype);
TriangleStripVertexBuffer.constructor = TriangleStripVertexBuffer;
