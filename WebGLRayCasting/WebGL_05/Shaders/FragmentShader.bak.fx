/* Licence: GPL version 3, Wikus Coetser, 2013 */

// References
// * http://cgvr.cs.uni-bremen.de/teaching/cg_literatur/lighthouse3d_view_frustum_culling/index.html
// * Learning WebGL - http://learningwebgl.com/blog/?page_id=1217
// * http://www.songho.ca/opengl/gl_projectionmatrix.html
// * http://www.txutxi.com/?p=182

precision mediump float;  

varying vec2 vTextureCoord; 
varying vec4 vColourAttribute;
varying vec4 vWorldInterpolatedPosition;

uniform sampler2D uSampler;
uniform int hasTexture;
uniform int applyTransforms;

void main(void)
{  
	if (hasTexture == 1) {
		gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); 
	}
	else {
		gl_FragColor = vColourAttribute;
	}
}
