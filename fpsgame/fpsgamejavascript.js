let scene, camera, renderer, score = 0, health = 100, lives = 3, obstacles = [], enemies = [], projectiles = [];
let playerSpeed = 0.1, enemySpeed = 0.02, mapLimit = 20;
let keys = { w: false, a: false, s: false, d: false, space: false };
let playerVelocity = new THREE.Vector3();

init();
animate();

function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  // Camera setup (first-person view)
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5; // Eye level
  camera.position.z = 5;

  // Renderer setup
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Event listeners for movement and shooting
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  // Window resize handling
  window.addEventListener('resize', onWindowResize, false);

  // Spawn initial enemies and obstacles
  spawnEnemy();
  createObstacles();
}

function onKeyDown(event) {
  switch(event.key.toLowerCase()) {
    case 'w': keys.w = true; break;
    case 'a': keys.a = true; break;
    case 's': keys.s = true; break;
    case 'd': keys.d = true; break;
    case ' ': keys.space = true; break; // Shooting
  }
}

function onKeyUp(event) {
  switch(event.key.toLowerCase()) {
    case 'w': keys.w = false; break;
    case 'a': keys.a = false; break;
    case 's': keys.s = false; break;
    case 'd': keys.d = false; break;
    case ' ': keys.space = false; break;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function createObstacles() {
  const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
  const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });

  for (let i = 0; i < 10; i++) {
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.x = Math.random() * mapLimit * 2 - mapLimit;
    obstacle.position.y = 1;
    obstacle.position.z = Math.random() * mapLimit * -2;
    obstacles.push(obstacle);
    scene.add(obstacle);
  }
}

function spawnEnemy() {
  const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
  const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);

  enemy.position.x = Math.random() * mapLimit * 2 - mapLimit;
  enemy.position.y = 1;
  enemy.position.z = Math.random() * -30 - 10;

  scene.add(enemy);
  enemies.push(enemy);
}

function shootProjectile() {
  const projectileGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const projectileMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);

  projectile.position.copy(camera.position);
  projectile.direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  
  projectiles.push(projectile);
  scene.add(projectile);
}

function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].position.add(projectiles[i].direction.clone().multiplyScalar(0.5));

    // Remove projectiles that go too far
    if (projectiles[i].position.z < -50) {
      scene.remove(projectiles[i]);
      projectiles.splice(i, 1);
    }

    // Check for collisions with enemies
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (projectiles[i] && enemies[j] && projectiles[i].position.distanceTo(enemies[j].position) < 1) {
        scene.remove(enemies[j]);
        scene.remove(projectiles[i]);
        enemies.splice(j, 1);
        projectiles.splice(i, 1);
        score += 1;
        document.getElementById("score").textContent = "Score: " + score;
        spawnEnemy(); // Spawn a new enemy after one is destroyed
        break;
      }
    }
  }
}

function updateMovement() {
  playerVelocity.set(0, 0, 0);

  if (keys.w) playerVelocity.z -= playerSpeed;
  if (keys.s) playerVelocity.z += playerSpeed;
  if (keys.a) playerVelocity.x -= playerSpeed;
  if (keys.d) playerVelocity.x += playerSpeed;

  const nextPosition = camera.position.clone().add(playerVelocity);

  // Check if the player is within the map limits
  if (Math.abs(nextPosition.x) < mapLimit && Math.abs(nextPosition.z) < mapLimit) {
    // Check for obstacle collisions
    let isBlocked = false;
    for (const obstacle of obstacles) {
      if (nextPosition.distanceTo(obstacle.position) < 2) {
        isBlocked = true;
        break;
      }
    }
    if (!isBlocked) {
      camera.position.add(playerVelocity);
    }
  }
}

function updateEnemies() {
  enemies.forEach(enemy => {
    enemy.position.z += enemySpeed;

    if (enemy.position.z > camera.position.z) {
      health -= 10;
      if (health <= 0) {
        health = 100;
        lives -= 1;
        document.getElementById("lives").textContent = "Lives: " + lives;
        if (lives <= 0) {
          alert('Game Over! Final Score: ' + score);
          resetGame();
        }
      }
      document.getElementById("health").textContent = "Health: " + health;
      enemy.position.z = Math.random() * -30 - 10;
      enemy.position.x = Math.random() * mapLimit * 2 - mapLimit;
    }
  });
}

function resetGame() {
  score = 0;
  health = 100;
  lives = 3;
  document.getElementById("score").textContent = "Score: 0";
  document.getElementById("health").textContent = "Health: 100";
  document.getElementById("lives").textContent = "Lives: 3";
}

function animate() {
  requestAnimationFrame(animate);

  // Update player movement
  updateMovement();

  // Shoot projectiles when space is pressed
  if (keys.space) shootProjectile();

  // Update projectiles
  updateProjectiles();

  // Move enemies
  updateEnemies();

  renderer.render(scene, camera);
}
