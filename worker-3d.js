import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const ANNOTATIONS = [
  { key: 'logo', label: 'Logo Bordado', bodyY: 0.78, bodyX: -0.12, side: 'left' },
  { key: 'tela', label: 'Tela Antifluido', bodyY: 0.65, bodyX: 0.18, side: 'right' },
  { key: 'franjas', label: 'Franjas Reflejantes', bodyY: 0.50, bodyX: -0.08, side: 'left' },
  { key: 'bolsillos', label: 'Bolsillos Reforzados', bodyY: 0.40, bodyX: 0.14, side: 'right' },
  { key: 'costuras', label: 'Costuras Triple Puntada', bodyY: 0.28, bodyX: -0.15, side: 'left' },
  { key: 'rodilleras', label: 'Rodilleras Integradas', bodyY: 0.15, bodyX: 0.10, side: 'right' },
];

function createAnnotationElements(container) {
  const overlay = document.createElement('div');
  overlay.className = 'worker-annotations-overlay';
  container.appendChild(overlay);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.classList.add('worker-annotations-svg');
  overlay.appendChild(svg);

  const elements = ANNOTATIONS.map((ann, i) => {
    const dot = document.createElement('div');
    dot.className = 'worker-ann-dot';
    overlay.appendChild(dot);

    const labelEl = document.createElement('div');
    labelEl.className = `worker-ann-label worker-ann-label--${ann.side}`;
    labelEl.textContent = ann.label;
    labelEl.style.animationDelay = `${i * 0.15}s`;
    overlay.appendChild(labelEl);

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('stroke', '#ffffff');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '4 3');
    line.setAttribute('opacity', '0.85');
    svg.appendChild(line);

    return { dot, labelEl, line, ann };
  });

  return { overlay, svg, elements };
}

function updateAnnotationPositions(container, annData, modelCenter3D, modelHeight3D, camera, renderer) {
  const rect = container.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  const isMobile = w < 768;
  const lineLen = isMobile ? 20 : 38;
  const labelGap = isMobile ? 22 : 40;

  annData.elements.forEach(({ dot, labelEl, line, ann }) => {
    const worldY = modelCenter3D.y - modelHeight3D / 2 + ann.bodyY * modelHeight3D;
    const worldX = (ann.bodyX || 0) * modelHeight3D;
    const pos3D = new THREE.Vector3(worldX, worldY, 0);
    pos3D.project(camera);

    const screenX = (pos3D.x * 0.5 + 0.5) * w;
    const screenY = (-pos3D.y * 0.5 + 0.5) * h;

    dot.style.left = screenX + 'px';
    dot.style.top = screenY + 'px';

    labelEl.style.top = screenY + 'px';
    if (ann.side === 'right') {
      labelEl.style.left = (screenX + labelGap) + 'px';
      labelEl.style.right = 'auto';
    } else {
      labelEl.style.right = (w - screenX + labelGap) + 'px';
      labelEl.style.left = 'auto';
    }

    const endX = ann.side === 'right' ? screenX + lineLen : screenX - lineLen;
    line.setAttribute('x1', screenX);
    line.setAttribute('y1', screenY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', screenY);
  });
}

export function initWorker3D() {
  const canvas = document.getElementById('worker-3d-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 2000);
  camera.position.set(0, 0, 300);

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

  let modelCenter = new THREE.Vector3();
  let modelHeight = 1;
  let annData = null;
  let modelLoaded = false;

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
      const size = box.getSize(new THREE.Vector3());
      obj.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 110;
      const scale = targetSize / maxDim;
      obj.scale.setScalar(scale);

      workerGroup.add(obj);

      const scaledBox = new THREE.Box3().setFromObject(workerGroup);
      modelCenter = scaledBox.getCenter(new THREE.Vector3());
      modelHeight = scaledBox.getSize(new THREE.Vector3()).y;

      camera.position.set(0, modelCenter.y, modelHeight * 2.2);
      camera.lookAt(0, modelCenter.y, 0);

      annData = createAnnotationElements(container);
      modelLoaded = true;
      updateAnnotationPositions(container, annData, modelCenter, modelHeight, camera, renderer);
    },
    undefined,
    (err) => {
      console.warn('Could not load worker OBJ:', err);
    }
  );

  function resize() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (modelLoaded && annData) {
      updateAnnotationPositions(container, annData, modelCenter, modelHeight, camera, renderer);
    }
  }

  resize();
  window.addEventListener('resize', resize);

  let showAnnotations = true;
  const ROTATION_SHOW_RANGE = Math.PI * 0.4;

  function animate() {
    requestAnimationFrame(animate);
    workerGroup.rotation.y += 0.004;

    const normalizedY = ((workerGroup.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isFacingCamera = normalizedY < ROTATION_SHOW_RANGE || normalizedY > (Math.PI * 2 - ROTATION_SHOW_RANGE);

    if (annData) {
      const targetOpacity = isFacingCamera ? 1 : 0;
      annData.overlay.style.opacity = targetOpacity;
      annData.overlay.style.pointerEvents = isFacingCamera ? 'auto' : 'none';

      if (isFacingCamera) {
        updateAnnotationPositions(container, annData, modelCenter, modelHeight, camera, renderer);
      }
    }

    renderer.render(scene, camera);
  }
  animate();
}
