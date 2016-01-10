/* Licence: GPL version 3, Wikus Coetser, 2013 */

/*
  Class for managing fragment shaders.
*/
Shaders = function (gl, vertexShader, fragmentShader) {
  if (!gl) throw new "GL Context not set.";
  if (!vertexShader) throw "No vertex shader given.";
  if (!fragmentShader) throw "No fragment shader given.";
  this.fragmentShader = fragmentShader;
  this.vertexShader = vertexShader;
  this.gl = gl;
  this.shaderProgram = null;
}

/*
  Compiles the shader.
*/
Shaders.prototype.Compile = function () {
  var gl = this.gl;
  // Utility function: Compile a shader
  var compileShader = function (gl, strCode, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, strCode);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw "Shader compile error: " + gl.getShaderInfoLog(shader);
    }
    return shader;
  }
  // Link shaders
  var compVertexShader = compileShader(this.gl, this.vertexShader, gl.VERTEX_SHADER);
  var compFragmentShader = compileShader(this.gl, this.fragmentShader, gl.FRAGMENT_SHADER);
  this.shaderProgram = this.gl.createProgram();
  this.gl.attachShader(this.shaderProgram, compVertexShader);
  this.gl.attachShader(this.shaderProgram, compFragmentShader);
  this.gl.linkProgram(this.shaderProgram);
  if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
    throw new "Failed to link shaders.";
  }
}

/*
  Attach shader.
*/
Shaders.prototype.AttachShader = function () {
  this.gl.useProgram(this.shaderProgram);
  // Shader parameters
  // Vertices
  this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
  this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
  // Texture coortinates
  this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
  this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
  // Colour attributes
  this.shaderProgram.colourAttribute = this.gl.getAttribLocation(this.shaderProgram, "aColourAttribute");  
  this.gl.enableVertexAttribArray(this.shaderProgram.colourAttribute);
  // Uniforms
  this.shaderProgram.hasTextureUniform = this.gl.getUniformLocation(this.shaderProgram, "hasTexture");
  this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
  this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
  this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
  this.shaderProgram.uEyePositionUniform = this.gl.getUniformLocation(this.shaderProgram, "uEyePosition");
  this.shaderProgram.isCameraBox = this.gl.getUniformLocation(this.shaderProgram, "uIsCameraBox");
}

/*
  Update the shader model-view matrix
*/
Shaders.prototype.UpdateModelViewMatrix = function (mvMatrix) {
  this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, mvMatrix);
}

/* 
  Update the shader projection matrix.
*/
Shaders.prototype.UpdateProjectionMatrix = function (pMatrix) {
  this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
}
