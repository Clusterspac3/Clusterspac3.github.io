// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light to simulate the sun
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Road variables
const roadSegments = [];
const roadLength = 100;
const roadWidth = 10;

// Function to create a road segment
function createRoadSegment(zPosition) {
    const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const roadSegment = new THREE.Mesh(roadGeometry, roadMaterial);
    roadSegment.rotation.x = -Math.PI / 2;
    roadSegment.position.z = zPosition;
    scene.add(roadSegment);
    roadSegments.push(roadSegment);
}

// Create initial road segments
for (let i = 0; i < 10; i++) {
    createRoadSegment(-i * roadLength);
}

// Create barriers on the sides of the road
const barrierGeometry = new THREE.BoxGeometry(0.2, 1, roadLength);
const barrierMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });

function createBarrier(zPosition) {
    const leftBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    leftBarrier.position.set(-5.1, 0.5, zPosition);
    scene.add(leftBarrier);

    const rightBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    rightBarrier.position.set(5.1, 0.5, zPosition);
    scene.add(rightBarrier);
}

// Create initial barriers
for (let i = 0; i < 10; i++) {
    createBarrier(-i * roadLength);
}

// Create car model for player
const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
const carMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 0.25, 0);
scene.add(car);

// Move the camera to follow the car
camera.position.set(0, 2, 5);

// Create array to store obstacles (oncoming cars)
const obstacles = [];

// Function to create obstacles
function createObstacle(zPosition) {
    const obstacleGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

    // Randomize the lane (left, center, right) and speed
    const lane = Math.floor(Math.random() * 3) - 1;  // -1 (left), 0 (center), 1 (right)
    obstacle.position.set(lane * 2, 0.25, zPosition);  // Place the obstacle at a certain Z position
    obstacle.userData = { speed: Math.random() * 0.1 + 0.1 };  // Random speed between 0.1 and 0.2
    obstacles.push(obstacle);
    scene.add(obstacle);
}

// Generate obstacles at random intervals along the road
for (let i = 1; i < 20; i++) {
    createObstacle(-i * roadLength - Math.random() * 50);
}

// Controls
let forwardSpeed = 0.2;  // Speed of the car
let moveLeft = false;
let moveRight = false;
let moveForward = false;  // For forward movement
let gameOver = false;

function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') moveLeft = true;
    if (event.key === 'ArrowRight') moveRight = true;
    if (event.key === 'ArrowUp') moveForward = true;  // Move forward on up arrow press
}

function handleKeyUp(event) {
    if (event.key === 'ArrowLeft') moveLeft = false;
    if (event.key === 'ArrowRight') moveRight = false;
    if (event.key === 'ArrowUp') moveForward = false;  // Stop moving forward on up arrow release
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

// Collision detection function
function detectCollision(object1, object2) {
    const object1Box = new THREE.Box3().setFromObject(object1);
    const object2Box = new THREE.Box3().setFromObject(object2);
    return object1Box.intersectsBox(object2Box);
}

// Update the game
function animate() {
    if (gameOver) {
        renderer.render(scene, camera);
        return;  // Stop the game when it's over
    }

    requestAnimationFrame(animate);

    // Move the car left or right
    if (moveLeft && car.position.x > -4.5) car.position.x -= 0.1;
    if (moveRight && car.position.x < 4.5) car.position.x += 0.1;

    // Control forward movement of the car with the up arrow
    if (moveForward) {
        car.position.z -= forwardSpeed;  // Car moves forward when up arrow is pressed
    }

    // Move the road segments to simulate endless road
    roadSegments.forEach(roadSegment => {
        roadSegment.position.z += forwardSpeed;
        if (roadSegment.position.z > 100) {
            roadSegment.position.z -= roadSegments.length * roadLength;  // Move road segment to the back
        }
    });

    // Move obstacles towards the player and detect collisions
    obstacles.forEach(obstacle => {
        obstacle.position.z += forwardSpeed;
        if (obstacle.position.z > 5) {
            scene.remove(obstacle);  // Remove obstacles that go off-screen
        }

        // Check for collision with the player's car
        if (detectCollision(car, obstacle)) {
            gameOver = true;
            alert('Game Over!');
        }
    });

    // Move barriers endlessly
    scene.children.forEach(child => {
        if (child.geometry === barrierGeometry) {
            child.position.z += forwardSpeed;
            if (child.position.z > 100) {
                child.position.z -= roadSegments.length * roadLength;  // Move barrier back
            }
        }
    });

    // Camera should follow the car
    camera.position.z = car.position.z + 5;
    camera.position.x = car.position.x;

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
