
//References:
// $(Github)\three.js\three.js-master\three.js-master\examples\misc_controls_orbit.html
// http://math.hws.edu/eck/cs424/notes2013/threejs/json-loader-demo.html

var container, stats;
var camera, controls, scene, renderer;


var render = function render() {

  // NB: Uncommenting this makes it slow
  //requestAnimationFrame(render);

  renderer.render(scene, camera);
  stats.update(); 
}

var resize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

var modelLoadedCallback = function (geometry, materials) {
  try {
    for (var x = -20; x < 20; x++) {
      for (var z = -20; z < 20; z++) {
        var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        object.position.set(x * 5, -5, z * 5);
        scene.add(object);
      }
    }
    render();
  }
  catch (err) {
    alert(err);
  }
}

var loadModel = function () {
  var loader = new THREE.JSONLoader();
  loader.load("model/cube.js", modelLoadedCallback);
}

var loadLight = function () {
  // Specular + diffuse
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 5, 0);
  scene.add(light);
  // Ambient
  light = new THREE.AmbientLight(0x222222);
  scene.add(light);
}

var init = function () {
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    throw "No WebGL detected!"
  }

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x000022, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Load content
  scene = new THREE.Scene();
  loadLight();
  loadModel();

  container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );
    
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 5;

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', render);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild(stats.domElement);

  window.addEventListener('resize', resize, false);
  window.addEventListener('error', function () {
    alert("error!");
  }, false);

  render();
}

window.addEventListener('load', init, false);
