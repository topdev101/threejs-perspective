const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffffff");

// sizes
let width = window.innerWidth;
let height = window.innerHeight;

// camera
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(50, 50, 50);
camera.lookAt(scene.position);
camera.rotation.z = Math.PI / 4;
camera.rotation.x = -Math.atan(Math.sqrt(2) / Math.sqrt(3));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
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
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;
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
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
