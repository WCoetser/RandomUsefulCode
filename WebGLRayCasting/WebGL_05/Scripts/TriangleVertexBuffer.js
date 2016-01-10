/* Licence: GPL version 3, Wikus Coetser, 2013 */

/*
  Class for managing triangle vertices.
*/
TriangleVertexBuffer = function (gl, shaders, modelViewMatrix, texture) {
  VertexBuffer.call(this, gl, shaders, modelViewMatrix, gl.TRIANGLES, texture);
}
TriangleVertexBuffer.prototype = new VertexBuffer();
TriangleVertexBuffer.constructor = TriangleVertexBuffer;
