const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffffff");

// sizes
const width = window.innerWidth;
const height = window.innerHeight;

// camera
const aspectRatio = width / height;
const zoom = 30; // Adjust zoom value to fit your scene
const camera = new THREE.OrthographicCamera(
  -zoom * aspectRatio,
  zoom * aspectRatio,
  zoom,
  -zoom,
  1,
  1000
);
camera.position.set(zoom, zoom, zoom);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const light = new THREE.DirectionalLight();
light.position.set(-15, 10, 10);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 1000;
light.shadow.camera.right = 20;
light.shadow.camera.top = 20;
light.shadow.camera.bottom = -20;
scene.add(light);

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load(
  "gltf/sample-facade-3d.gltf",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const edges = new THREE.EdgesGeometry(child.geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: "#1A1A1A" });
        const lineSegments = new THREE.LineSegments(edges, lineMaterial);
        scene.add(lineSegments);
      }
    });
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error("Error loading GLTF model", error);
  }
);

window.addEventListener("resize", function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  const aspectRatio = width / height;
  camera.left = -zoom * aspectRatio;
  camera.right = zoom * aspectRatio;
  camera.top = zoom;
  camera.bottom = -zoom;
  camera.updateProjectionMatrix();
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
