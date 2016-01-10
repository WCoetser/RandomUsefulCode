/* Licence: GPL version 3, Wikus Coetser, 2013 */

/*
  Class for managing triangle strip vertices.
*/
TriangleStripVertexBuffer = function (gl, shaders, modelViewMatrix, texture) {
  VertexBuffer.call(this, gl, shaders, modelViewMatrix, gl.TRIANGLE_STRIP, texture);
}
TriangleStripVertexBuffer.prototype = new VertexBuffer();
TriangleStripVertexBuffer.constructor = TriangleStripVertexBuffer;
