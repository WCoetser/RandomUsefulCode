/* Licence: GPL version 3, Wikus Coetser, see http://www.gnu.org/licenses/gpl-3.0.html */

/*
  Base class for vertex buffers.
*/
VertexBuffer = function (gl, shaders, modelViewMatrix, glDrawType, texture) {
  this.buffer = [];
  this.texCoordBuff = [];
  this.colourBuff = [];
  this.gl = gl;
  this.boundBuffer = null; // set in bind buffer function further down.
  this.boundTexCoordBuff = null; // set further down, bings WebGL buffer for texture coordinates
  this.boundColourBuff = null; // store vertex colour attributes
  this.shaders = shaders;
  this.modelViewMatrix = modelViewMatrix ? modelViewMatrix : mat4.create(); // load identity matrix if none specified
  this.glDrawType = glDrawType;
  this.texture = texture; // if texture is empty, draw only colour
  this.colourMapIndex = VertexBuffer.ColourMapHitCounter++;
  // Calculate colour map colour
  this.colourMapColour = [0,0,0,1];
  this.colourMapColour[0] = Math.floor(this.colourMapIndex / 65536) / 256;
  var convertRemainder = this.colourMapIndex % 65536;
  this.colourMapColour[1] = Math.floor(convertRemainder / 256) / 256;
  convertRemainder = this.colourMapIndex % 256;
  this.colourMapColour[2] = convertRemainder / 256;
  // Enable/disable drowing of the click map
  this.DisableColourMap();
}

/*
  Colour map index counter for detecting what was renederred. The value 0 is reserved for "nothing renderred"
  and is used by the skybox.
*/
VertexBuffer.ColourMapHitCounter = 1;

/*
  Add colours for vertices. This is 4 component colours in RGBA format in the [0,1] range.
*/
VertexBuffer.prototype.AddVertexColour = function () {
  if (arguments[0] instanceof Array) {
    if (arguments[0].length % 4 != 0) throw "Argument array must have length that is multiple of 4.";
    this.colourBuff = this.colourBuff.concat(arguments[0]);
  }
  else {
    if (arguments.length != 4) throw "Expected 4 components for vertex colour.";
    this.colourBuff.push(arguments[0]);
    this.colourBuff.push(arguments[1]);
    this.colourBuff.push(arguments[2]);
    this.colourBuff.push(arguments[3]);
  }
}

/*
  Adds a vertex to the end of the buffer.
*/
VertexBuffer.prototype.AddVertexPosition = function () {
  if (arguments[0] instanceof Array) {
    if (arguments[0].length % 3 != 0) throw "Argument array must have length that is multiple of 3.";
    this.buffer = this.buffer.concat(arguments[0]);
  }
  else {
    if (arguments.length != 3) throw "Expected 3 components for vertex position.";
    this.buffer.push(arguments[0]);
    this.buffer.push(arguments[1]);
    this.buffer.push(arguments[2]);
  }
}

/*
  Enable rendering the colour map for picking purposes
*/
VertexBuffer.prototype.EnableColourMap = function () {
  this.colourMapEnabled = true;
}

/*
  Enable rendering the colour map for picking purposes
*/
VertexBuffer.prototype.DisableColourMap = function () {
  this.colourMapEnabled = false;
}

/*
  Adds a texture coordinate, or a collection of texture coordinates.
*/
VertexBuffer.prototype.AddTexturePosition = function () {
  if (arguments[0] instanceof Array) {
    if (arguments[0].length % 2 != 0) throw "Argument array must have length that is multiple of 2.";
    this.texCoordBuff = this.texCoordBuff.concat(arguments[0]);
  }
  else {
    if (arguments.length != 2) throw "Expected 2 components for texture coordinate.";
    this.texCoordBuff.push(arguments[0]);
    this.texCoordBuff.push(arguments[1]);
  }
}

/*
  Binds the vertices to WebGL
*/
VertexBuffer.prototype.BindBuffers = function () {
  // Validations
  if (!this.buffer || this.buffer.length == 0) throw "No vertices specified.";
  var hasTexture = this.texCoordBuff && this.texCoordBuff.length > 0;
  var hasColour = this.colourBuff && this.colourBuff.length > 0;
  if (hasTexture && ((this.texCoordBuff.length / 2) != (this.buffer.length / 3))) throw "Number of texture points do not match number of vertices.";
  if (hasColour && ((this.colourBuff.length / 4) != (this.buffer.length / 3))) throw "Number of vertex colour attributes do not match number of vertices.";
  if (!(hasTexture || hasColour)) throw "Buffer must have a colour buffer or texture coordinate buffer assigned.";
  // Vertex positions
  this.boundBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.boundBuffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.buffer), this.gl.STATIC_DRAW);
  this.boundBuffer.itemSize = 3;
  this.boundBuffer.numItems = this.buffer.length / 3;
  // Texture coordinates ... ensure attributes for vertex attribute array
  if (!hasTexture) {
    this.texCoordBuff = new Array(this.buffer.length * 2);
    for (var i = 0; i < this.texCoordBuff.length; i++) this.texCoordBuff[i] = 0;
  }
  this.boundTexCoordBuff = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.boundTexCoordBuff);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texCoordBuff), this.gl.STATIC_DRAW);
  this.boundTexCoordBuff.itemSize = 2;
  this.boundTexCoordBuff.numItems = this.texCoordBuff.length / 2;
  // Colour attributes ... ensure attributes for vertex attribute array
  if (!hasColour) {
    this.colourBuff = new Array(this.buffer.length * 4);
    for (var i = 0; i < this.colourBuff.length; i++) this.colourBuff[i] = 1; // default to white
  }
  this.boundColourBuff = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.boundColourBuff);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colourBuff), this.gl.STATIC_DRAW);
  this.boundColourBuff.itemSize = 4;
  this.boundColourBuff.numItems = this.colourBuff.length / 4;
}

/*
  Draws the triangles.
*/
VertexBuffer.prototype.Draw = function () {
  if (!this.boundBuffer) throw "Call BindBuffer first to bind data for drawing.";
  // Set colour map settings
  this.gl.uniform1i(this.shaders.shaderProgram.drawColourMap, this.colourMapEnabled ? 1 : 0);
  this.gl.uniform4fv(this.shaders.shaderProgram.colourMapColour, new Float32Array(this.colourMapColour));
  // Render object colours
  var hasTexture = this.texCoordBuff && this.texCoordBuff.length > 0;
  var hasColour = this.colourBuff && this.colourBuff.length > 0;
  // Move model to it's designated area
  this.shaders.UpdateModelViewMatrix(this.modelViewMatrix);
  if (this.texture) {
    // Enable texture
    this.gl.uniform1i(this.shaders.shaderProgram.hasTextureUniform, 1);
    // Switch textures
    this.gl.uniform1i(this.shaders.shaderProgram.samplerUniform, this.texture.textureName);
  }
  else {
    // Disable texture
    this.gl.uniform1i(this.shaders.shaderProgram.hasTextureUniform, 0);
  }
  // Set texture coordinates
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.boundTexCoordBuff);
  this.gl.vertexAttribPointer(this.shaders.shaderProgram.textureCoordAttribute, this.boundTexCoordBuff.itemSize, this.gl.FLOAT, false, 0, 0);
  // Set vertex colour attributes
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.boundColourBuff);
  this.gl.vertexAttribPointer(this.shaders.shaderProgram.colourAttribute, this.boundColourBuff.itemSize, this.gl.FLOAT, false, 0, 0);
  // Draw vertices
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.boundBuffer);
  this.gl.vertexAttribPointer(this.shaders.shaderProgram.vertexPositionAttribute, this.boundBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
  this.gl.drawArrays(this.glDrawType, 0, this.boundBuffer.numItems);
}
