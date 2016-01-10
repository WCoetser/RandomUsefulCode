/* Licence: GPL version 3, Wikus Coetser, 2013, see http://www.gnu.org/licenses/gpl-3.0.html */

/*
  Viewport class for connecting canvas to WebGL context and doing projections.
*/
Viewport = function (canvas) {
  try {
    if (!canvas) throw "No canvas element given.";
    this.canvas = canvas;
    this.InitializeEvents();
    // Initialize camera posistion
    this.position = [0, 0, 0];
    this.lookVector = [0, 0, -1];
    this.moveSpeed = 5; // kph, ie. walking speed
    this.rotationsPerSecond = 0.5; // i.e. how long it takes to rotate 360 degrees
    this.lastTime = Date.now();
    // Initialize WebGL
    this.gl = canvas.getContext("experimental-webgl");
    this.viewportWidth = canvas.width;
    this.viewportHeight = canvas.height;
    this.gl.enable(this.gl.DEPTH_TEST);
    this.vertexBuffers = new Array();
    // Skybox for ray casting purposes
    this.skybox = null;
    // Colour map for picking purposes
    this.renderColourMap = true;
    this.InitializePickingBuffers();
    this.pickingList = {};
    // Frame rate counter
    this.lastFrameTime = Date.now();
    this.frameCount = 0;
  } catch (e) {
    throw "Failed to initialize WebGL: " + e;
  }
}

/* 
  Hook keybord and mouse events.
*/
Viewport.prototype.InitializeEvents = function () {
  var canvas = this.canvas;
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
  $(canvas).mouseup(function (event) {
    // Request a colour map frame grab ... this happens in render loop
    var canvasOffset = $(canvas).offset();
    this.mouseState.mouseDown = false;
    this.mouseState.mouseClickPosition = [event.pageX - Math.round(canvasOffset.left), event.pageY - Math.round(canvasOffset.top)];
    this.grabColourMapFrame = true;
    console.log(this.mouseState.toString());
  }.bind(this));
  $(canvas).mousedown(function (event) {
    // Request a colour map frame grab ... this happens in render loop
    var canvasOffset = $(canvas).offset();
    this.mouseState.mouseDown = true;
    this.mouseState.mouseClickPosition = [event.pageX - Math.round(canvasOffset.left), event.pageY - Math.round(canvasOffset.top)];
    this.grabColourMapFrame = true;
    console.log(this.mouseState.toString());
  }.bind(this));
  $(canvas).mouseout(function (event) {
    // Cancel mouse events when the cursor leaves the canvas
    this.mouseState.mouseDown = false;
    this.mouseState.mouseClickPosition = null;
    this.grabColourMapFrame = false;
    console.log(this.mouseState.toString());
  }.bind(this));
  // Keeps track of current input state
  this.keyState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
  };
  this.mouseState = {
    mouseDown: false,
    mouseClickPosition: null,
    toString: function () {
      return "Mouse down: " + this.mouseDown + " Mouse Position: " + (this.mouseClickPosition ? (this.mouseClickPosition[0] + "," + this.mouseClickPosition[1]) : "Not set");
    }
  };
}

Viewport.prototype.InitializePickingBuffers = function () {
  // refrence: http://learningwebgl.com/blog/?p=1786
  // This procress is similar to renderring to a buffer. The only difference is that it will be externally read on demand.
  var gl = this.gl;
  this.lastCapturedColourMap = new Uint8Array(this.viewportWidth * this.viewportHeight * 4);
  this.fb = this.gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
  rttTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, rttTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.viewportWidth, this.viewportHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.viewportWidth, this.viewportHeight);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
}

/*
  Set up the skybox for ray casting purposes.
*/
Viewport.prototype.InitializeSkybox = function () {
  // ... coordinates found at http://stackoverflow.com/questions/4157998/cube-with-triangle-strips-and-vector-normals-in-opengl
  var mvMatrix = mat4.create();
  mat4.identity(mvMatrix);
  var squareBuffer = new TriangleStripVertexBuffer(this.gl, this.shaders, mvMatrix);
  squareBuffer.AddVertexPosition([
      -1, 1, 1,
      1, 1, 1,
      -1, -1, 1,
      1, -1, 1,
      -1, -1, -1,
      1, -1, -1,
      -1, 1, -1,
      1, 1, -1,
      -1, 1, 1,
      1, 1, 1,
      1, -1, 1,
      1, 1, -1,
      1, -1, -1,
      -1, -1, -1,
      -1, 1, -1,
      -1, -1, 1,
      -1, 1, 1
  ]);
  squareBuffer.AddVertexColour([
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0
  ]);
  squareBuffer.BindBuffers();
  this.skybox = squareBuffer;
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
  // Skybox is dependent on shaders being initialized
  this.InitializeSkybox();
}

/*
  Add vertex array buffers.
*/
Viewport.prototype.AddBuffer = function (buffer) {
  if (!(buffer instanceof VertexBuffer)) throw "Invalid argument: Expected vertex buffer.";
  this.vertexBuffers.push(buffer);
  // Update list of buffers for picking
  this.pickingList[buffer.colourMapIndex] = buffer;
}

/*
  Draw buffers using shader.
*/
Viewport.prototype.Draw = function () {
  // Main drawing loop
  var gl = this.gl;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Set the "camera box" location to be arround the camera
  var skyboxposition = mat4.create();
  mat4.translate(skyboxposition, mat4.create(), this.position);
  this.skybox.modelViewMatrix = skyboxposition;
  this.gl.disable(this.gl.DEPTH_TEST);
  this.gl.uniform1i(this.shaders.shaderProgram.isSkyBox, 1);
  if (this.renderColourMap) this.skybox.EnableColourMap();
  else this.skybox.DisableColourMap();
  this.skybox.Draw();
  this.gl.uniform1i(this.shaders.shaderProgram.isSkyBox, 0);
  this.gl.enable(this.gl.DEPTH_TEST);
  // Render the scene
  for (var i = 0; i < this.vertexBuffers.length; i++) {
    if (this.renderColourMap) this.vertexBuffers[i].EnableColourMap();
    else this.vertexBuffers[i].DisableColourMap();
    this.vertexBuffers[i].Draw();
  }
}

/* 
  This is called when the user selected a vertex buffer with the mouse down or mouse up event.
  Override from outside API ... mouseState is not a clone, do not overwrite
*/
Viewport.prototype.VertexBufferMouseEvent = function (mouseState, selectedObject) { }

/*
  Get the colour at the coordinates in the last captured colour map.
*/
Viewport.prototype.GetColourMapColour = function (x, y) {
  if (x >= this.viewportWidth || y >= this.viewportHeight
    || x < 0 || y < 0) throw "Invalid colour map pixel address";
  if (!this.lastCapturedColourMap) throw "Colour map not captured.";
  // 4 components per colour, and y is inverted
  var firstAddress = (this.viewportHeight - 1 - y) * this.viewportWidth * 4 + x * 4;
  return [this.lastCapturedColourMap[firstAddress],
          this.lastCapturedColourMap[firstAddress + 1],
          this.lastCapturedColourMap[firstAddress + 2]];
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
  // Render scene to screen
  this.renderColourMap = false;
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  this.Draw();
  // Render picking colour map buffer off-screen 
  if (this.grabColourMapFrame) {
    this.renderColourMap = true;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
    this.Draw();
    this.gl.readPixels(0, 0, this.viewportWidth, this.viewportHeight, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.lastCapturedColourMap);
    if (this.mouseState.mouseClickPosition) {
      var colour = this.GetColourMapColour(this.mouseState.mouseClickPosition[0], this.mouseState.mouseClickPosition[1]);
      var vertexBufferIndex = colour[0] * 65536 + colour[1] * 256 + colour[2];
      if (this.pickingList && this.pickingList[vertexBufferIndex]) {
        this.VertexBufferMouseEvent(this.mouseState, this.pickingList[vertexBufferIndex]);
      }
    }      
    this.grabColourMapFrame = false;
  }
  // Frame counter ... report framerate every 100th frame
  this.frameCount++;
  if (this.frameCount % 100 == 0) {
    var then = Date.now();
    var fps = 100 / ((then - this.lastFrameTime) / 1000);
    this.frameCount = 0;
    this.lastFrameTime = then;
    console.log('Frame rate = ' + fps + " fps");
  }
  // Next frame
  window.requestAnimationFrame(this.StartRenderLoop.bind(this));
}
