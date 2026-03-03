import * as THREE from 'three';

function createIndustrialWorker(material) {
  const worker = new THREE.Group();

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.46, 1.05, 10, 18), material);
  torso.position.y = 1.42;
  worker.add(torso);

  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.3, 16), material);
  hips.position.y = 0.78;
  worker.add(hips);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.14, 12), material);
  neck.position.y = 2.22;
  worker.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 16), material);
  head.position.y = 2.52;
  worker.add(head);

  const helmetTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.33, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
    material
  );
  helmetTop.position.y = 2.68;
  helmetTop.rotation.x = Math.PI;
  worker.add(helmetTop);

  const helmetBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.06, 22), material);
  helmetBrim.position.y = 2.6;
  worker.add(helmetBrim);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.14, 2, 1, 1), material);
  visor.position.set(0, 2.56, 0.33);
  worker.add(visor);

  const upperLegLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.62, 8, 14), material);
  upperLegLeft.position.set(-0.2, 0.5, 0.01);
  worker.add(upperLegLeft);

  const upperLegRight = upperLegLeft.clone();
  upperLegRight.position.x = 0.2;
  worker.add(upperLegRight);

  const lowerLegLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.58, 8, 14), material);
  lowerLegLeft.position.set(-0.2, -0.12, 0.03);
  worker.add(lowerLegLeft);

  const lowerLegRight = lowerLegLeft.clone();
  lowerLegRight.position.x = 0.2;
  worker.add(lowerLegRight);

  const bootLeft = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.45, 3, 2, 4), material);
  bootLeft.position.set(-0.2, -0.55, 0.12);
  worker.add(bootLeft);

  const bootRight = bootLeft.clone();
  bootRight.position.x = 0.2;
  worker.add(bootRight);

  const armLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.7, 8, 14), material);
  armLeft.position.set(-0.6, 1.6, 0);
  armLeft.rotation.z = Math.PI * 0.2;
  worker.add(armLeft);

  const armRight = armLeft.clone();
  armRight.position.x = 0.6;
  armRight.rotation.z = -Math.PI * 0.2;
  worker.add(armRight);

  const forearmLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.62, 8, 14), material);
  forearmLeft.position.set(-0.74, 1.06, 0.03);
  forearmLeft.rotation.z = Math.PI * 0.08;
  worker.add(forearmLeft);

  const forearmRight = forearmLeft.clone();
  forearmRight.position.x = 0.74;
  forearmRight.rotation.z = -Math.PI * 0.08;
  worker.add(forearmRight);

  const handLeft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), material);
  handLeft.position.set(-0.74, 0.66, 0.06);
  worker.add(handLeft);

  const handRight = handLeft.clone();
  handRight.position.x = 0.74;
  worker.add(handRight);

  const pocketLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.17, 0.05), material);
  pocketLeft.position.set(-0.2, 0.62, 0.2);
  worker.add(pocketLeft);

  const pocketRight = pocketLeft.clone();
  pocketRight.position.x = 0.2;
  worker.add(pocketRight);

  return worker;
}

export function initWireframeUniform() {
  const container = document.getElementById('uniforme-3d');
  if (!container || container.dataset.ready === 'true') return;

  const hasWebGL = typeof window !== 'undefined' && !!window.WebGLRenderingContext;
  if (!hasWebGL) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return;
  }

  container.dataset.ready = 'true';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
  camera.position.set(0, 1.2, 4);
  camera.lookAt(0, 1.1, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const turntable = new THREE.Group();
  scene.add(turntable);

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x39ff14,
    wireframe: true,
  });

  const worker = createIndustrialWorker(wireMaterial);
  turntable.add(worker);

  const box = new THREE.Box3().setFromObject(worker);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  worker.position.sub(center);
  worker.position.y = size.y * 0.38;

  const clock = new THREE.Clock();
  const secondsPerTurn = 10;
  let frameId = 0;

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  resize();

  const animate = () => {
    frameId = window.requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    turntable.rotation.y = (t / secondsPerTurn) * Math.PI * 2;
    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener('resize', resize);
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  observer?.observe(container);

  const cleanup = () => {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    observer?.disconnect();
    renderer.dispose();
    container.removeAttribute('data-ready');
  };

  window.addEventListener('beforeunload', cleanup, { once: true });
}
