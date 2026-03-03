import * as THREE from 'three';

export function initGridRoom() {
  const canvas = document.getElementById('grid-room-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100);
  camera.position.set(3, 1.5, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const gridColor = new THREE.Color(0x45b35a);

  const gridMaterial = new THREE.LineBasicMaterial({
    color: gridColor,
    transparent: true,
    opacity: 0.15,
  });

  const gridMaterialBright = new THREE.LineBasicMaterial({
    color: gridColor,
    transparent: true,
    opacity: 0.3,
  });

  function createGridPlane(width, height, divisionsW, divisionsH, majorEvery) {
    const group = new THREE.Group();
    const hw = width / 2;
    const hh = height / 2;
    const stepW = width / divisionsW;
    const stepH = height / divisionsH;

    for (let i = 0; i <= divisionsW; i++) {
      const x = -hw + i * stepW;
      const pts = [new THREE.Vector3(x, 0, -hh), new THREE.Vector3(x, 0, hh)];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = i % majorEvery === 0 ? gridMaterialBright : gridMaterial;
      group.add(new THREE.Line(geom, mat));
    }

    for (let j = 0; j <= divisionsH; j++) {
      const z = -hh + j * stepH;
      const pts = [new THREE.Vector3(-hw, 0, z), new THREE.Vector3(hw, 0, z)];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = j % majorEvery === 0 ? gridMaterialBright : gridMaterial;
      group.add(new THREE.Line(geom, mat));
    }

    return group;
  }

  const floor = createGridPlane(12, 12, 24, 24, 4);
  floor.position.set(0, -3, 0);
  scene.add(floor);

  const backWall = createGridPlane(12, 8, 24, 16, 4);
  backWall.rotation.x = -Math.PI / 2;
  backWall.position.set(0, 1, -6);
  scene.add(backWall);

  const leftWall = createGridPlane(12, 8, 24, 16, 4);
  leftWall.rotation.x = -Math.PI / 2;
  leftWall.rotation.z = Math.PI / 2;
  leftWall.position.set(6, 1, 0);
  scene.add(leftWall);

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
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

  let raf;
  function animate() {
    raf = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
