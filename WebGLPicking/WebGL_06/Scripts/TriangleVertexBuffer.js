/* Licence: GPL version 3, Wikus Coetser, 2013, see http://www.gnu.org/licenses/gpl-3.0.html */

/*
  Class for managing triangle vertices.
*/
TriangleVertexBuffer = function (gl, shaders, modelViewMatrix, texture) {
  VertexBuffer.call(this, gl, shaders, modelViewMatrix, gl.TRIANGLES, texture);
}
TriangleVertexBuffer.prototype = Object.create(VertexBuffer.prototype);
TriangleVertexBuffer.constructor = TriangleVertexBuffer;
