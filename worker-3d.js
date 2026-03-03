import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export function initWorker3D() {
  const canvas = document.getElementById('worker-3d-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
  camera.position.set(0, 80, 250);
  camera.lookAt(0, 60, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x45b35a,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });

  const workerGroup = new THREE.Group();
  scene.add(workerGroup);

  const loader = new OBJLoader();
  loader.load(
    '/WORKER_DELIVERY.obj',
    (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = wireframeMaterial;
        }
      });

      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      obj.position.sub(center);

      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetHeight = 160;
      const scale = targetHeight / maxDim;
      obj.scale.setScalar(scale);

      workerGroup.add(obj);

      const scaledBox = new THREE.Box3().setFromObject(workerGroup);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      camera.position.set(0, scaledCenter.y, maxDim * scale * 1.6);
      camera.lookAt(0, scaledCenter.y, 0);
    },
    undefined,
    (err) => {
      console.warn('Could not load worker OBJ:', err);
    }
  );

  function resize() {
    const container = canvas.parentElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * Math.min(window.devicePixelRatio, 2);
    canvas.height = h * Math.min(window.devicePixelRatio, 2);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener('resize', resize);

  function animate() {
    requestAnimationFrame(animate);
    workerGroup.rotation.y += 0.004;
    renderer.render(scene, camera);
  }
  animate();
}
