import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createIndustrialWorker(material) {
  const worker = new THREE.Group();

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.46, 1.05, 10, 18), material);
  body.position.y = 1.45;
  worker.add(body);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.12, 12, 1), material);
  neck.position.y = 2.28;
  worker.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 16), material);
  head.position.y = 2.58;
  worker.add(head);

  const helmetTop = new THREE.Mesh(new THREE.SphereGeometry(0.31, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), material);
  helmetTop.position.y = 2.73;
  helmetTop.rotation.x = Math.PI;
  worker.add(helmetTop);

  const helmetBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.06, 18), material);
  helmetBrim.position.y = 2.64;
  worker.add(helmetBrim);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.1, 2, 1, 1), material);
  visor.position.set(0, 2.61, 0.31);
  worker.add(visor);

  const upperLegLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.6, 8, 14), material);
  upperLegLeft.position.set(-0.19, 0.63, 0.02);
  worker.add(upperLegLeft);

  const upperLegRight = upperLegLeft.clone();
  upperLegRight.position.x = 0.19;
  worker.add(upperLegRight);

  const lowerLegLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.62, 8, 14), material);
  lowerLegLeft.position.set(-0.19, 0.03, 0.03);
  worker.add(lowerLegLeft);

  const lowerLegRight = lowerLegLeft.clone();
  lowerLegRight.position.x = 0.19;
  worker.add(lowerLegRight);

  const bootLeft = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.45, 3, 2, 4), material);
  bootLeft.position.set(-0.19, -0.44, 0.11);
  worker.add(bootLeft);

  const bootRight = bootLeft.clone();
  bootRight.position.x = 0.19;
  worker.add(bootRight);

  const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.74, 8, 14), material);
  armL.position.set(-0.58, 1.62, 0);
  armL.rotation.z = Math.PI * 0.19;
  worker.add(armL);

  const armR = armL.clone();
  armR.position.x = 0.58;
  armR.rotation.z = -Math.PI * 0.19;
  worker.add(armR);

  const forearmL = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.7, 8, 14), material);
  forearmL.position.set(-0.74, 1.02, 0.03);
  forearmL.rotation.z = Math.PI * 0.08;
  worker.add(forearmL);

  const forearmR = forearmL.clone();
  forearmR.position.x = 0.74;
  forearmR.rotation.z = -Math.PI * 0.08;
  worker.add(forearmR);

  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), material);
  handL.position.set(-0.74, 0.59, 0.04);
  worker.add(handL);

  const handR = handL.clone();
  handR.position.x = 0.74;
  worker.add(handR);

  const pocketL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.18, 0.05, 1, 2, 1), material);
  pocketL.position.set(-0.19, 0.67, 0.18);
  worker.add(pocketL);

  const pocketR = pocketL.clone();
  pocketR.position.x = 0.19;
  worker.add(pocketR);

  return worker;
}

export function initWireframeUniform() {
  const container = document.getElementById('uniforme-3d');
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.set(0, 1.2, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = false;

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x39ff14,
    wireframe: true,
  });

  const turntable = new THREE.Group();
  scene.add(turntable);

  const worker = createIndustrialWorker(wireMaterial);
  turntable.add(worker);

  const box = new THREE.Box3().setFromObject(worker);
  const center = box.getCenter(new THREE.Vector3());
  worker.position.sub(center);
  worker.position.y += 1.1;

  const clock = new THREE.Clock();
  const secondsPerTurn = 10;
  let frameId = 0;

  function animate() {
    frameId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    turntable.rotation.y = (t / secondsPerTurn) * Math.PI * 2;
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', resize);

  const observer = new ResizeObserver(resize);
  observer.observe(container);

  const cleanup = () => {
    cancelAnimationFrame(frameId);
    observer.disconnect();
    window.removeEventListener('resize', resize);
    controls.dispose();
    renderer.dispose();
  };

  window.addEventListener('beforeunload', cleanup, { once: true });
}
