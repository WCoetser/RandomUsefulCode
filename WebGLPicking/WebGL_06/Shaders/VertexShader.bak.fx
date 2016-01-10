/* Licence: GPL version 3, Wikus Coetser, 2013 */

// References
// * http://cgvr.cs.uni-bremen.de/teaching/cg_literatur/lighthouse3d_view_frustum_culling/index.html
// * Learning WebGL - http://learningwebgl.com/blog/?page_id=1217
// * http://www.songho.ca/opengl/gl_projectionmatrix.html
// * http://www.txutxi.com/?p=182

attribute vec3 aVertexPosition; 
attribute vec2 aTextureCoord; 
attribute vec4 aColourAttribute;

uniform mat4 uMVMatrix; 
uniform mat4 uPMatrix; 
uniform int hasTexture;

varying vec2 vTextureCoord; 
varying vec4 vColourAttribute;
varying vec4 vWorldInterpolatedPosition;

void main(void) { 
  // Switch transforms on or off
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vWorldInterpolatedPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
  // Draw colour or texture
  if (hasTexture == 1) {
    vTextureCoord = aTextureCoord; 
  }
  else {
    vColourAttribute = aColourAttribute;
  }
}
