import * as THREE from 'three'
  import { WebGPURenderer } from 'three/webgpu';
  // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  
  // --- Core Scene Setup ---
  let camera, scene, renderer, mesh;
  
  async function init() {
    // 1. Check for WebGPU availability.
    if (!navigator.gpu) {
      document.getElementById('error').style.display = 'block';
      console.error("WebGPU not supported on this browser.");
      return;
    }
    
    // 2. Scene and Camera (Standard Three.js setup)
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.z = 3;
    
    // 3. Geometry and Material (Standard Three.js setup)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // Use a standard material. Three.js automatically converts it to a WGSL shader.
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.5, roughness: 0.5 });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Add some lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    
    // 4. The WebGPU Renderer
    // Instead of new THREE.WebGLRenderer(), we use new WebGPURenderer().
    renderer = new WebGPURenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // The init() method on the renderer is asynchronous because setting up
    // a WebGPU device can take time. We must wait for it to complete.
    await renderer.init();
    
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);
    
    // Start the animation loop
    animate();
  }
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  function animate() {
    // The renderer's animation loop manages the render calls internally.
    renderer.setAnimationLoop(render);
  }
  
  function render() {
    // Simple animation
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    
    // The renderer handles the command encoding and submission to the GPU queue.
    renderer.render(scene, camera);
  }
  
  // Start the application
  init();
