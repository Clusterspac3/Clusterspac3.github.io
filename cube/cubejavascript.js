let scene, camera, renderer, cube, platform;
let speed = 0.1;
let cubeSpeed = { x: 0, z: 0 };

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Platform
    const platformGeometry = new THREE.BoxGeometry(10, 0.5, 10);
    const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(0, -0.25, 0);
    scene.add(platform);

    // Cube (player)
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0.5, 0);
    scene.add(cube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Event listeners for movement
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Resize handling
    window.addEventListener('resize', onWindowResize);
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
            cubeSpeed.z = -speed;
            break;
        case 'ArrowDown':
            cubeSpeed.z = speed;
            break;
        case 'ArrowLeft':
            cubeSpeed.x = -speed;
            break;
        case 'ArrowRight':
            cubeSpeed.x = speed;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'ArrowDown':
            cubeSpeed.z = 0;
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            cubeSpeed.x = 0;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Update cube position
    cube.position.x += cubeSpeed.x;
    cube.position.z += cubeSpeed.z;

    // Boundaries
    if (cube.position.x < -5) cube.position.x = -5;
    if (cube.position.x > 5) cube.position.x = 5;
    if (cube.position.z < -5) cube.position.z = -5;
    if (cube.position.z > 5) cube.position.z = 5;

    // Render
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
