/* Licence: GPL version 3, Wikus Coetser, 2013, see http://www.gnu.org/licenses/gpl-3.0.html */

/*
  Main script entry point
*/

var texture1 = null;
var texture2 = null;
var i = 0;

TexturesLoaded = function () {
  i++;
  if (i < 2) return;

  // Hook unhandled error
  $(window).error(function (obj) {
    alert("Unhandled error found: See console for log.");
  });

  var viewport = new Viewport(document.getElementById("glcanvas"));
  viewport.SetViewInformation(45, 0.1, 100, [0, 0, 0]);
  viewport.VertexBufferMouseEvent = function (mouseState, selectedObject) {
    // not down = up
    if (!mouseState.mouseDown) {
      alert("Selected: " + selectedObject.tag); // tag is passed in from outside
    }
  };

  // Shaders
  var shaders = new Shaders(viewport.gl, $("#shader-vs")[0].innerHTML, $("#shader-fs")[0].innerHTML);
  shaders.Compile();
  shaders.AttachShader();
  viewport.SetShaders(shaders);

  // Textures
  var tex1 = new Texture(texture1, viewport.gl);
  tex1.BindTexture();
  var tex2 = new Texture(texture2, viewport.gl);
  tex2.BindTexture();

  // Load models
  var mvMatrix = mat4.create();
  mat4.identity(mvMatrix);
  mat4.translate(mvMatrix, mvMatrix, [-1.5, 0.0, -7.0]);  
  triangleBuffer = new TriangleVertexBuffer(viewport.gl, shaders, mvMatrix); // i.e. no texture
  triangleBuffer.AddVertexPosition([
       0.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0
  ]);
  triangleBuffer.AddVertexColour([
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ]);
  triangleBuffer.BindBuffers();
  triangleBuffer.tag = "triangle"; // used with picking
  viewport.AddBuffer(triangleBuffer);

  mvMatrix = mat4.create();
  mat4.identity(mvMatrix);
  mat4.translate(mvMatrix, mvMatrix, [-1.5, 0.0, -7.0]);
  mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
  squareBuffer = new TriangleStripVertexBuffer(viewport.gl, shaders, mvMatrix, tex1);
  squareBuffer.AddVertexPosition([
       1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
  ]);
  squareBuffer.AddTexturePosition([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0
  ]);
  squareBuffer.BindBuffers();
  squareBuffer.tag = "square"; // used with picking
  viewport.AddBuffer(squareBuffer);

  viewport.SetMoveSpeed(10); // KM/H
  viewport.SetRotationsPerSecond(0.3); // rotations/second
  viewport.SetPosition([0, 2, 5]);
  viewport.SetViewVector([0, 0, -1]);
  viewport.StartRenderLoop();
}

$(document).ready(function () {
  texture1 = new Image();
  texture1.src = "Images/bricks.jpg";
  texture2 = new Image();
  texture2.src = "Images/grass.jpg";
  $(texture1).load(function (t) {
    TexturesLoaded();
  });
  $(texture2).load(function (t) {
    TexturesLoaded();
  });
});
