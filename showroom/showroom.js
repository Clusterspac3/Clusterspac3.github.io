// showroom.js
// Basic setup
let scene, camera, renderer, controls;
init();
animate();

function init() {
    const canvasContainer = document.getElementById('showroom-canvas');
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth rotation    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    camera = new THREE.PerspectiveCamera(50, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 10);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Light
    const light = new THREE.AmbientLight(0x404040, 2);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load GLTF models
    const loader = new THREE.GLTFLoader();
    
    // Load Model 1
    loader.load('mercedes.glb', function (gltf) {
        const model = gltf.scene;
        model.position.set(-3, 0, 0);
        scene.add(model);
    });

    // Load Model 2
    loader.load('porsche.fbx', function (gltf) {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        scene.add(model);
    });

    // Load Model 3
    loader.load('pagani.fbx', function (gltf) {
        const model = gltf.scene;
        model.position.set(3, 0, 0);
        scene.add(model);
    });

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const canvasContainer = document.getElementById('showroom-canvas');
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
