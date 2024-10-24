let scene, camera, renderer, controls;
init();
animate();

function init() {
    const canvasContainer = document.getElementById('showroom-canvas');

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    // Camera
    camera = new THREE.PerspectiveCamera(50, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 10);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth rotation

    // Light
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Loaders
    const gltfLoader = new THREE.GLTFLoader();
    const fbxLoader = new THREE.FBXLoader();

    // Load GLTF Model 1
    gltfLoader.load('mercedes.glb', function (gltf) {
        const model = gltf.scene;
        model.position.set(-3, 0, 0); // Position of model 1
        scene.add(model);
    }, undefined, function (error) {
        console.error('An error occurred while loading the Mercedes model:', error);
    });

    // Load FBX Model 2
    fbxLoader.load('porsche.fbx', function (fbx) {
        fbx.position.set(0, 0, 0); // Position of model 2
        scene.add(fbx);
    }, undefined, function (error) {
        console.error('An error occurred while loading the Porsche model:', error);
    });

    // Load FBX Model 3
    fbxLoader.load('pagani.fbx', function (fbx) {
        fbx.position.set(3, 0, 0); // Position of model 3
        scene.add(fbx);
    }, undefined, function (error) {
        console.error('An error occurred while loading the Pagani model:', error);
    });

    // Handle window resize
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
    controls.update(); // Required for OrbitControls to function properly
    renderer.render(scene, camera);
}
