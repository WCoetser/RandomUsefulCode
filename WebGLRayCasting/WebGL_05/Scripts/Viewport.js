/* Licence: GPL version 3, Wikus Coetser, 2013 */

/*
  Viewport class for connecting canvas to WebGL context and doing projections.
*/
Viewport = function (canvas) {
  try {
    if (!canvas) throw "No canvas element given.";
    this.canvas = canvas;
    // Hook up user input ... 
    $("body").keydown(function (event) {
      this.OnKeyDown(String.fromCharCode(event.which));
    }.bind(this));
    $("body").keyup(function (event) {
      this.OnKeyUp(String.fromCharCode(event.which));
    }.bind(this));
    $("body").blur(function (event) {
      this.ClearKeys();
    }.bind(this));
    // Initialize camera posistion
    this.position = [0, 0, 0];
    this.lookVector = [0, 0, -1];
    this.moveSpeed = 5; // kph, ie. walking speed
    this.rotationsPerSecond = 0.5; // i.e. how long it takes to rotate 360 degrees
    this.lastTime = Date.now();
    this.keyState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false
    };
    // The ruler is a cube that is renderred arround the camara position for ray-casting puroposes
    this.ruler = null;
    // Initialize WebGL
    this.gl = canvas.getContext("experimental-webgl");
    this.viewportWidth = canvas.width;
    this.viewportHeight = canvas.height;
    this.gl.enable(this.gl.DEPTH_TEST);
    this.vertexBuffers = new Array();
  } catch (e) {
    throw "Failed to initialize WebGL: " + e;
  }
}

/*
  Sets the camera position
*/
Viewport.prototype.SetPosition = function (p) {
  if (!(p instanceof Array)) throw "Expected position as 3 component array";
  this.position = p;
  // Position changed ...
  this.gl.uniform3fv(this.shaders.shaderProgram.uEyePositionUniform, new Float32Array(this.position));
}

/*
  Set direction in which camera points.
*/
Viewport.prototype.SetViewVector = function (v) {
  if (!(v instanceof Array)) throw "Expected position as 3 component array";
  this.lookVector = v;
}

/*
  Set movement speed in km/h
*/
Viewport.prototype.SetMoveSpeed = function (s) {
  if (!s) throw "Invalid argument for movement speed.";
  this.moveSpeed = s;
}

/*
  How long it takes to rotate by 360 degress in seconds, using the left and right buttons.
*/
Viewport.prototype.SetRotationsPerSecond = function (rs) {
  if (!rs) throw "Invalid argument for rotations per second.";
  this.rotationsPerSecond = rs;
}

/*
  Projection and view information.
*/
Viewport.prototype.SetViewInformation = function (angle, nearClip, farClip, clearColour) {
  if (!angle) throw "Angle not given.";
  if (!nearClip) throw "Near clipping distance not given.";
  if (!farClip) throw "Far clipping distance not given.";
  if (!clearColour 
    || !(clearColour instanceof Array) 
    || clearColour.length != 3) throw "Invalid clear colour.";
  this.angle = angle;
  this.nearClip = nearClip;
  this.farClip = farClip;
  this.clearColour = clearColour;
  // Set projection matrix
  var gl = this.gl;
  gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
  pMatrix = this.GetViewMatrix();
  if (this.shaders) this.shaders.UpdateProjectionMatrix(pMatrix);
  gl.clearColor(this.clearColour[0], this.clearColour[1], this.clearColour[2], 1.0);
}


/*
  Handles the hey down event on the canvas.
*/
Viewport.prototype.OnKeyDown = function (char) {
  if (char == 'W' || char == 'w') this.keyState.forward = true;
  if (char == 'S' || char == 's') this.keyState.backward = true;
  if (char == 'D' || char == 'd') this.keyState.right = true;
  if (char == 'A' || char == 'a') this.keyState.left = true;
  if (char == 'R' || char == 'r') this.keyState.up = true;
  if (char == 'F' || char == 'f') this.keyState.down = true;
}

/*
  Handles the keyup event for the canvas.
*/
Viewport.prototype.OnKeyUp = function (char) {
  if (char == 'W' || char == 'w') this.keyState.forward = false;
  if (char == 'S' || char == 's') this.keyState.backward = false;
  if (char == 'D' || char == 'd') this.keyState.right = false;
  if (char == 'A' || char == 'a') this.keyState.left = false;
  if (char == 'R' || char == 'r') this.keyState.up = false;
  if (char == 'F' || char == 'f') this.keyState.down = false;
}

/*
  Sets all the keys as "up".
*/
Viewport.prototype.ClearKeys = function () {
  this.keyState.forward = false;
  this.keyState.backward = false;
  this.keyState.right = false;
  this.keyState.left = false;
  this.keyState.up = false;
  this.keyState.down = false;
}

/*
  Gets the current projection matrix, taking camara position and view vector into account
*/
Viewport.prototype.GetViewMatrix = function () {
  var pMatrix = mat4.create();
  var pMatrixOut = mat4.create();
  mat4.perspective(pMatrix, this.angle, this.viewportWidth / this.viewportHeight, this.nearClip, this.farClip);
  var lookat = mat4.create();
  var up = [0, 1, 0];
  mat4.lookAt(lookat, this.position, [this.position[0] + this.lookVector[0], this.position[1] + this.lookVector[1], this.position[2] + this.lookVector[2]], up);
  mat4.mul(pMatrixOut, pMatrix, lookat);
  return pMatrixOut;
}

/*
  Set vertex and fragment shaders.
*/
Viewport.prototype.SetShaders = function (shaders) {
  if (!shaders && !(shaders instanceof Shaders)) throw "Invalid argument: shaders";
  var gl = this.gl;
  this.shaders = shaders;
  if (this.angle) {
    // Set projection matrix
    pMatrix = this.GetViewMatrix();
    this.shaders.UpdateProjectionMatrix(pMatrix);
  }
}

/*
  Add vertex array buffers.
*/
Viewport.prototype.AddBuffer = function (buffer) {
  if (!(buffer instanceof VertexBuffer)) throw "Invalid argument: Expected vertex buffer.";
  this.vertexBuffers.push(buffer);
}

/*
  Draw buffers using shader.
*/
Viewport.prototype.Draw = function () {
  var gl = this.gl;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Set the "camera box" location to be arround the camera
  var rulerposition = mat4.create();
  mat4.translate(rulerposition, mat4.create(), this.position);
  this.ruler.modelViewMatrix = rulerposition;
  this.gl.disable(this.gl.DEPTH_TEST);
  this.gl.uniform1i(this.shaders.shaderProgram.isCameraBox, 1);
  this.ruler.Draw();
  this.gl.uniform1i(this.shaders.shaderProgram.isCameraBox, 0);
  this.gl.enable(this.gl.DEPTH_TEST);
  for (var i = 0; i < this.vertexBuffers.length; i++) this.vertexBuffers[i].Draw();
}

/*
  Continually request new frames from WebGL and render them in the browser.
*/
Viewport.prototype.StartRenderLoop = function () {
  // Move camera
  if (this.keyState.forward
    || this.keyState.backward
    || this.keyState.left
    || this.keyState.right
    || this.keyState.up
    || this.keyState.down) {
    // Get time difference
    var now = Date.now();
    var dHours = (now - this.lastTime) / 3600000; // milliseconds to hours
    this.lastTime = now;
    // Do rotations, in rotations per second
    if (this.keyState.left || this.keyState.right)
    {
      var angle = (this.keyState.left ? 1 : -1) * (dHours * 3600) * this.rotationsPerSecond * 2 * Math.PI;
      var rotationMatrix = mat4.create(); // loads identity matrix
      mat4.rotateY(rotationMatrix, mat4.create(), angle);
      var newLookVector = vec3.create();
      vec3.transformMat4(newLookVector, vec3.fromValues(this.lookVector[0], this.lookVector[1], this.lookVector[2]), rotationMatrix);
      this.lookVector[0] = newLookVector[0];
      this.lookVector[1] = newLookVector[1];
      this.lookVector[2] = newLookVector[2];
    }
    var dist = dHours * this.moveSpeed * 1000; // km to m
    // Move forward/backward in killometers per hour
    if (this.keyState.forward
      || this.keyState.backward) {
      var sdist = (this.keyState.backward ? -1 : 1) * dist;
      var viewDist = vec3.length(this.lookVector);
      this.position[0] += (this.lookVector[0] / viewDist) * sdist;
      this.position[1] += (this.lookVector[1] / viewDist) * sdist;
      this.position[2] += (this.lookVector[2] / viewDist) * sdist;
      // Position changed ...
      this.gl.uniform3fv(this.shaders.shaderProgram.uEyePositionUniform, new Float32Array(this.position));
    }
    if (this.keyState.up
      || this.keyState.down) {
      this.position[1] += (this.keyState.up ? +1.0 : -1) * dist;
      // Position changed ...
      this.gl.uniform3fv(this.shaders.shaderProgram.uEyePositionUniform, new Float32Array(this.position));
    }
  }
  else {
    this.lastTime = Date.now();
  }
  this.SetViewInformation(this.angle, this.nearClip, this.farClip, this.clearColour);
  // Render scene
  this.Draw();
  // Rerender
  window.requestAnimationFrame(this.StartRenderLoop.bind(this));
}
