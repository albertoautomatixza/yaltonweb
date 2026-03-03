import * as THREE from 'three';

let scene, camera, renderer, uniformGroup, annotationsGroup;
let canvas;
let scrollProgress = 0;

const GREEN = 0x45b35a;
const GREEN_DIM = 0x2d7a3d;
const GREEN_BRIGHT = 0x66ff88;

export function initUniformWireframe() {
  canvas = document.getElementById('uniform-wireframe-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  uniformGroup = new THREE.Group();
  annotationsGroup = new THREE.Group();

  buildUniform();
  buildAnnotations();

  scene.add(uniformGroup);
  scene.add(annotationsGroup);

  uniformGroup.position.y = -0.3;
  annotationsGroup.position.y = -0.3;

  resize();
  window.addEventListener('resize', resize);

  const section = document.getElementById('wireframe');
  if (section) {
    updateScroll();
  }

  animate();
}

function createLine(points, color, opacity, dashed) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  let material;
  if (dashed) {
    material = new THREE.LineDashedMaterial({
      color,
      transparent: true,
      opacity,
      dashSize: 0.08,
      gapSize: 0.06,
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    return line;
  }
  material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
  return new THREE.Line(geometry, material);
}

function createSmoothCurve(controlPoints, segments, closed) {
  const curve = new THREE.CatmullRomCurve3(controlPoints, closed, 'catmullrom', 0.5);
  return curve.getPoints(segments);
}

function buildUniform() {
  buildCollar();
  buildTorso();
  buildLeftSleeve();
  buildRightSleeve();
  buildPants();
  buildLeftBoot();
  buildRightBoot();
  buildDetailLines();
}

function buildCollar() {
  const collarLeft = createSmoothCurve([
    new THREE.Vector3(-0.35, 3.5, 0),
    new THREE.Vector3(-0.25, 3.65, 0.1),
    new THREE.Vector3(-0.05, 3.75, 0.15),
    new THREE.Vector3(0, 3.78, 0.15),
  ], 20, false);

  const collarRight = createSmoothCurve([
    new THREE.Vector3(0, 3.78, 0.15),
    new THREE.Vector3(0.05, 3.75, 0.15),
    new THREE.Vector3(0.25, 3.65, 0.1),
    new THREE.Vector3(0.35, 3.5, 0),
  ], 20, false);

  uniformGroup.add(createLine(collarLeft, GREEN_BRIGHT, 0.9, false));
  uniformGroup.add(createLine(collarRight, GREEN_BRIGHT, 0.9, false));

  const collarBack = createSmoothCurve([
    new THREE.Vector3(-0.35, 3.5, 0),
    new THREE.Vector3(-0.3, 3.6, -0.1),
    new THREE.Vector3(0, 3.65, -0.15),
    new THREE.Vector3(0.3, 3.6, -0.1),
    new THREE.Vector3(0.35, 3.5, 0),
  ], 30, false);
  uniformGroup.add(createLine(collarBack, GREEN, 0.5, false));

  const neckOpening = createSmoothCurve([
    new THREE.Vector3(-0.35, 3.5, 0),
    new THREE.Vector3(-0.3, 3.3, 0.05),
    new THREE.Vector3(0, 3.15, 0.08),
    new THREE.Vector3(0.3, 3.3, 0.05),
    new THREE.Vector3(0.35, 3.5, 0),
  ], 30, false);
  uniformGroup.add(createLine(neckOpening, GREEN, 0.6, false));

  const buttonPositions = [3.35, 3.2, 3.05];
  buttonPositions.forEach(y => {
    const pts = [];
    for (let i = 0; i <= 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * 0.03, y + Math.sin(angle) * 0.03, 0.08));
    }
    uniformGroup.add(createLine(pts, GREEN_BRIGHT, 0.6, false));
  });
}

function buildTorso() {
  const torsoLeft = createSmoothCurve([
    new THREE.Vector3(-0.35, 3.5, 0),
    new THREE.Vector3(-0.7, 3.3, 0),
    new THREE.Vector3(-0.85, 2.8, 0.05),
    new THREE.Vector3(-0.65, 2.0, 0.03),
    new THREE.Vector3(-0.55, 1.2, 0.02),
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(-0.48, 0.0, 0),
  ], 60, false);

  const torsoRight = createSmoothCurve([
    new THREE.Vector3(0.35, 3.5, 0),
    new THREE.Vector3(0.7, 3.3, 0),
    new THREE.Vector3(0.85, 2.8, 0.05),
    new THREE.Vector3(0.65, 2.0, 0.03),
    new THREE.Vector3(0.55, 1.2, 0.02),
    new THREE.Vector3(0.5, 0.5, 0),
    new THREE.Vector3(0.48, 0.0, 0),
  ], 60, false);

  uniformGroup.add(createLine(torsoLeft, GREEN_BRIGHT, 0.85, false));
  uniformGroup.add(createLine(torsoRight, GREEN_BRIGHT, 0.85, false));

  const hemLine = createSmoothCurve([
    new THREE.Vector3(-0.48, 0.0, 0),
    new THREE.Vector3(-0.3, -0.05, 0.02),
    new THREE.Vector3(0, -0.08, 0.03),
    new THREE.Vector3(0.3, -0.05, 0.02),
    new THREE.Vector3(0.48, 0.0, 0),
  ], 30, false);
  uniformGroup.add(createLine(hemLine, GREEN_BRIGHT, 0.7, false));

  const centerLine = [
    new THREE.Vector3(0, 3.15, 0.08),
    new THREE.Vector3(0, -0.08, 0.03),
  ];
  uniformGroup.add(createLine(centerLine, GREEN_DIM, 0.25, true));
}

function buildLeftSleeve() {
  const shoulderTop = createSmoothCurve([
    new THREE.Vector3(-0.7, 3.3, 0),
    new THREE.Vector3(-0.95, 3.15, 0),
    new THREE.Vector3(-1.2, 2.9, 0),
    new THREE.Vector3(-1.55, 2.5, 0),
    new THREE.Vector3(-1.75, 2.1, 0),
  ], 30, false);

  const sleeveBottom = createSmoothCurve([
    new THREE.Vector3(-0.85, 2.8, 0.05),
    new THREE.Vector3(-1.1, 2.6, 0.03),
    new THREE.Vector3(-1.4, 2.35, 0.02),
    new THREE.Vector3(-1.65, 2.05, 0),
  ], 30, false);

  uniformGroup.add(createLine(shoulderTop, GREEN_BRIGHT, 0.85, false));
  uniformGroup.add(createLine(sleeveBottom, GREEN_BRIGHT, 0.7, false));

  const sleeveCuff = createSmoothCurve([
    new THREE.Vector3(-1.75, 2.1, 0),
    new THREE.Vector3(-1.72, 2.05, 0.05),
    new THREE.Vector3(-1.65, 2.05, 0),
  ], 10, false);
  uniformGroup.add(createLine(sleeveCuff, GREEN_BRIGHT, 0.7, false));
}

function buildRightSleeve() {
  const shoulderTop = createSmoothCurve([
    new THREE.Vector3(0.7, 3.3, 0),
    new THREE.Vector3(0.95, 3.15, 0),
    new THREE.Vector3(1.2, 2.9, 0),
    new THREE.Vector3(1.55, 2.5, 0),
    new THREE.Vector3(1.75, 2.1, 0),
  ], 30, false);

  const sleeveBottom = createSmoothCurve([
    new THREE.Vector3(0.85, 2.8, 0.05),
    new THREE.Vector3(1.1, 2.6, 0.03),
    new THREE.Vector3(1.4, 2.35, 0.02),
    new THREE.Vector3(1.65, 2.05, 0),
  ], 30, false);

  uniformGroup.add(createLine(shoulderTop, GREEN_BRIGHT, 0.85, false));
  uniformGroup.add(createLine(sleeveBottom, GREEN_BRIGHT, 0.7, false));

  const sleeveCuff = createSmoothCurve([
    new THREE.Vector3(1.75, 2.1, 0),
    new THREE.Vector3(1.72, 2.05, 0.05),
    new THREE.Vector3(1.65, 2.05, 0),
  ], 10, false);
  uniformGroup.add(createLine(sleeveCuff, GREEN_BRIGHT, 0.7, false));
}

function buildPants() {
  const waistLine = createSmoothCurve([
    new THREE.Vector3(-0.5, -0.1, 0),
    new THREE.Vector3(-0.3, -0.15, 0.02),
    new THREE.Vector3(0, -0.18, 0.03),
    new THREE.Vector3(0.3, -0.15, 0.02),
    new THREE.Vector3(0.5, -0.1, 0),
  ], 30, false);
  uniformGroup.add(createLine(waistLine, GREEN_BRIGHT, 0.7, false));

  const beltLine1 = createSmoothCurve([
    new THREE.Vector3(-0.5, -0.2, 0),
    new THREE.Vector3(0, -0.28, 0.03),
    new THREE.Vector3(0.5, -0.2, 0),
  ], 20, false);
  uniformGroup.add(createLine(beltLine1, GREEN, 0.4, false));

  const beltLine2 = createSmoothCurve([
    new THREE.Vector3(-0.5, -0.35, 0),
    new THREE.Vector3(0, -0.43, 0.03),
    new THREE.Vector3(0.5, -0.35, 0),
  ], 20, false);
  uniformGroup.add(createLine(beltLine2, GREEN, 0.4, false));

  const leftLegOuter = createSmoothCurve([
    new THREE.Vector3(-0.5, -0.1, 0),
    new THREE.Vector3(-0.55, -0.8, 0.02),
    new THREE.Vector3(-0.52, -1.5, 0.02),
    new THREE.Vector3(-0.48, -2.2, 0.01),
    new THREE.Vector3(-0.42, -2.8, 0),
    new THREE.Vector3(-0.38, -3.3, 0),
  ], 50, false);

  const leftLegInner = createSmoothCurve([
    new THREE.Vector3(-0.1, -0.5, 0.02),
    new THREE.Vector3(-0.15, -1.0, 0.02),
    new THREE.Vector3(-0.18, -1.5, 0.01),
    new THREE.Vector3(-0.2, -2.2, 0.01),
    new THREE.Vector3(-0.22, -2.8, 0),
    new THREE.Vector3(-0.22, -3.3, 0),
  ], 50, false);

  uniformGroup.add(createLine(leftLegOuter, GREEN_BRIGHT, 0.85, false));
  uniformGroup.add(createLine(leftLegInner, GREEN, 0.6, false));

  const rightLegOuter = createSmoothCurve([
    new THREE.Vector3(0.5, -0.1, 0),
    new THREE.Vector3(0.55, -0.8, 0.02),
    new THREE.Vector3(0.52, -1.5, 0.02),
    new THREE.Vector3(0.48, -2.2, 0.01),
    new THREE.Vector3(0.42, -2.8, 0),
    new THREE.Vector3(0.38, -3.3, 0),
  ], 50, false);

  const rightLegInner = createSmoothCurve([
    new THREE.Vector3(0.1, -0.5, 0.02),
    new THREE.Vector3(0.15, -1.0, 0.02),
    new THREE.Vector3(0.18, -1.5, 0.01),
    new THREE.Vector3(0.2, -2.2, 0.01),
    new THREE.Vector3(0.22, -2.8, 0),
    new THREE.Vector3(0.22, -3.3, 0),
  ], 50, false);

  uniformGroup.add(createLine(rightLegOuter, GREEN_BRIGHT, 0.85, false));
  uniformGroup.add(createLine(rightLegInner, GREEN, 0.6, false));

  const crotchCurve = createSmoothCurve([
    new THREE.Vector3(-0.1, -0.5, 0.02),
    new THREE.Vector3(0, -0.6, 0.03),
    new THREE.Vector3(0.1, -0.5, 0.02),
  ], 15, false);
  uniformGroup.add(createLine(crotchCurve, GREEN, 0.5, false));

  const leftAnkle = [
    new THREE.Vector3(-0.38, -3.3, 0),
    new THREE.Vector3(-0.22, -3.3, 0),
  ];
  uniformGroup.add(createLine(leftAnkle, GREEN_BRIGHT, 0.7, false));

  const rightAnkle = [
    new THREE.Vector3(0.38, -3.3, 0),
    new THREE.Vector3(0.22, -3.3, 0),
  ];
  uniformGroup.add(createLine(rightAnkle, GREEN_BRIGHT, 0.7, false));
}

function buildLeftBoot() {
  const bootOuter = createSmoothCurve([
    new THREE.Vector3(-0.38, -3.3, 0),
    new THREE.Vector3(-0.4, -3.5, 0.02),
    new THREE.Vector3(-0.42, -3.7, 0.05),
    new THREE.Vector3(-0.42, -3.85, 0.08),
    new THREE.Vector3(-0.4, -3.95, 0.12),
    new THREE.Vector3(-0.15, -4.0, 0.2),
  ], 30, false);

  const bootInner = createSmoothCurve([
    new THREE.Vector3(-0.22, -3.3, 0),
    new THREE.Vector3(-0.2, -3.5, 0.02),
    new THREE.Vector3(-0.18, -3.7, 0.05),
    new THREE.Vector3(-0.18, -3.85, 0.08),
    new THREE.Vector3(-0.18, -3.95, 0.12),
    new THREE.Vector3(-0.15, -4.0, 0.2),
  ], 30, false);

  uniformGroup.add(createLine(bootOuter, GREEN_BRIGHT, 0.7, false));
  uniformGroup.add(createLine(bootInner, GREEN, 0.5, false));

  const sole = createSmoothCurve([
    new THREE.Vector3(-0.42, -3.95, 0.12),
    new THREE.Vector3(-0.42, -3.98, 0.15),
    new THREE.Vector3(-0.3, -4.02, 0.22),
    new THREE.Vector3(-0.15, -4.0, 0.2),
  ], 15, false);
  uniformGroup.add(createLine(sole, GREEN, 0.4, false));
}

function buildRightBoot() {
  const bootOuter = createSmoothCurve([
    new THREE.Vector3(0.38, -3.3, 0),
    new THREE.Vector3(0.4, -3.5, 0.02),
    new THREE.Vector3(0.42, -3.7, 0.05),
    new THREE.Vector3(0.42, -3.85, 0.08),
    new THREE.Vector3(0.4, -3.95, 0.12),
    new THREE.Vector3(0.15, -4.0, 0.2),
  ], 30, false);

  const bootInner = createSmoothCurve([
    new THREE.Vector3(0.22, -3.3, 0),
    new THREE.Vector3(0.2, -3.5, 0.02),
    new THREE.Vector3(0.18, -3.7, 0.05),
    new THREE.Vector3(0.18, -3.85, 0.08),
    new THREE.Vector3(0.18, -3.95, 0.12),
    new THREE.Vector3(0.15, -4.0, 0.2),
  ], 30, false);

  uniformGroup.add(createLine(bootOuter, GREEN_BRIGHT, 0.7, false));
  uniformGroup.add(createLine(bootInner, GREEN, 0.5, false));

  const sole = createSmoothCurve([
    new THREE.Vector3(0.42, -3.95, 0.12),
    new THREE.Vector3(0.42, -3.98, 0.15),
    new THREE.Vector3(0.3, -4.02, 0.22),
    new THREE.Vector3(0.15, -4.0, 0.2),
  ], 15, false);
  uniformGroup.add(createLine(sole, GREEN, 0.4, false));
}

function buildDetailLines() {
  const shoulderSeamLeft = createSmoothCurve([
    new THREE.Vector3(-0.7, 3.3, 0),
    new THREE.Vector3(-0.75, 3.0, 0.02),
    new THREE.Vector3(-0.85, 2.8, 0.05),
  ], 15, false);
  uniformGroup.add(createLine(shoulderSeamLeft, GREEN_DIM, 0.3, true));

  const shoulderSeamRight = createSmoothCurve([
    new THREE.Vector3(0.7, 3.3, 0),
    new THREE.Vector3(0.75, 3.0, 0.02),
    new THREE.Vector3(0.85, 2.8, 0.05),
  ], 15, false);
  uniformGroup.add(createLine(shoulderSeamRight, GREEN_DIM, 0.3, true));

  const chestLine = [
    new THREE.Vector3(-0.75, 2.5, 0.04),
    new THREE.Vector3(0.75, 2.5, 0.04),
  ];
  uniformGroup.add(createLine(chestLine, GREEN_DIM, 0.15, true));

  const waistDash = [
    new THREE.Vector3(-0.6, 0.8, 0.02),
    new THREE.Vector3(0.6, 0.8, 0.02),
  ];
  uniformGroup.add(createLine(waistDash, GREEN_DIM, 0.15, true));

  const kneeLine = [
    new THREE.Vector3(-0.55, -2.0, 0.01),
    new THREE.Vector3(0.55, -2.0, 0.01),
  ];
  uniformGroup.add(createLine(kneeLine, GREEN_DIM, 0.15, true));

  const pocketLeft = [
    new THREE.Vector3(-0.42, 2.6, 0.04),
    new THREE.Vector3(-0.42, 2.2, 0.04),
    new THREE.Vector3(-0.12, 2.2, 0.04),
    new THREE.Vector3(-0.12, 2.6, 0.04),
    new THREE.Vector3(-0.42, 2.6, 0.04),
  ];
  uniformGroup.add(createLine(pocketLeft, GREEN_DIM, 0.35, true));
}

function buildAnnotations() {
  addAnnotation(
    new THREE.Vector3(-0.27, 2.4, 0.04),
    new THREE.Vector3(-2.0, 2.8, 0),
    'LOGO',
  );

  addAnnotation(
    new THREE.Vector3(0.75, 1.8, 0.03),
    new THREE.Vector3(2.2, 2.2, 0),
    'FRANJA REFLECTIVA',
  );

  addAnnotation(
    new THREE.Vector3(-0.48, -0.25, 0),
    new THREE.Vector3(-2.2, -0.5, 0),
    'CINTURON',
  );

  addAnnotation(
    new THREE.Vector3(0.45, -2.0, 0.01),
    new THREE.Vector3(2.2, -1.5, 0),
    'RODILLERA',
  );

  addAnnotation(
    new THREE.Vector3(-0.3, -3.6, 0.05),
    new THREE.Vector3(-2.0, -3.2, 0),
    'BOTA INDUSTRIAL',
  );

  addAnnotation(
    new THREE.Vector3(0, 3.78, 0.15),
    new THREE.Vector3(1.8, 3.8, 0),
    'CUELLO',
  );

  addScaleIndicator();
  addMeasurementLine();
}

function addAnnotation(startPoint, endPoint, label) {
  const midPoint = new THREE.Vector3(
    endPoint.x,
    startPoint.y + (endPoint.y - startPoint.y) * 0.5,
    startPoint.z * 0.5,
  );

  const leaderLine = [startPoint, midPoint, endPoint];
  annotationsGroup.add(createLine(leaderLine, GREEN_DIM, 0.5, false));

  const dotPts = [];
  for (let i = 0; i <= 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    dotPts.push(new THREE.Vector3(
      startPoint.x + Math.cos(angle) * 0.04,
      startPoint.y + Math.sin(angle) * 0.04,
      startPoint.z,
    ));
  }
  annotationsGroup.add(createLine(dotPts, GREEN_BRIGHT, 0.6, false));

  createTextSprite(label, endPoint);
}

function createTextSprite(text, position) {
  const cnv = document.createElement('canvas');
  cnv.width = 512;
  cnv.height = 64;
  const ctx = cnv.getContext('2d');
  ctx.clearRect(0, 0, 512, 64);
  ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#45b35a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 8, 32);

  const texture = new THREE.CanvasTexture(cnv);
  texture.minFilter = THREE.LinearFilter;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.7,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(position);
  sprite.position.x += 0.5;
  sprite.scale.set(1.8, 0.22, 1);
  annotationsGroup.add(sprite);
}

function addScaleIndicator() {
  const lineLeft = [
    new THREE.Vector3(-1.8, -4.3, 0),
    new THREE.Vector3(-0.5, -4.3, 0),
  ];
  annotationsGroup.add(createLine(lineLeft, GREEN_DIM, 0.3, false));

  const tickL1 = [
    new THREE.Vector3(-1.8, -4.25, 0),
    new THREE.Vector3(-1.8, -4.35, 0),
  ];
  annotationsGroup.add(createLine(tickL1, GREEN_DIM, 0.3, false));

  const tickL2 = [
    new THREE.Vector3(-0.5, -4.25, 0),
    new THREE.Vector3(-0.5, -4.35, 0),
  ];
  annotationsGroup.add(createLine(tickL2, GREEN_DIM, 0.3, false));

  createSmallTextSprite('ESCALA 1:4', new THREE.Vector3(-1.6, -4.5, 0), 0.4);
}

function addMeasurementLine() {
  const lineRight = [
    new THREE.Vector3(0.5, -4.3, 0),
    new THREE.Vector3(1.8, -4.3, 0),
  ];
  annotationsGroup.add(createLine(lineRight, GREEN_DIM, 0.3, false));

  const tickR1 = [
    new THREE.Vector3(0.5, -4.25, 0),
    new THREE.Vector3(0.5, -4.35, 0),
  ];
  annotationsGroup.add(createLine(tickR1, GREEN_DIM, 0.3, false));

  const tickR2 = [
    new THREE.Vector3(1.8, -4.25, 0),
    new THREE.Vector3(1.8, -4.35, 0),
  ];
  annotationsGroup.add(createLine(tickR2, GREEN_DIM, 0.3, false));

  createSmallTextSprite('REV. 03', new THREE.Vector3(0.6, -4.5, 0), 0.4);
}

function createSmallTextSprite(text, position, opacity) {
  const cnv = document.createElement('canvas');
  cnv.width = 256;
  cnv.height = 48;
  const ctx = cnv.getContext('2d');
  ctx.clearRect(0, 0, 256, 48);
  ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#45b35a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 4, 24);

  const texture = new THREE.CanvasTexture(cnv);
  texture.minFilter = THREE.LinearFilter;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: opacity || 0.4,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(position);
  sprite.scale.set(1.2, 0.22, 1);
  annotationsGroup.add(sprite);
}

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

function updateScroll() {
  const section = document.getElementById('wireframe');
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const wh = window.innerHeight;
  const raw = (wh - rect.top) / (wh + rect.height);
  scrollProgress = Math.min(Math.max(raw, 0), 1);

  const startZ = 12;
  const endZ = 6;
  camera.position.z = startZ + (endZ - startZ) * scrollProgress;

  const startY = 1.5;
  const endY = -0.3;
  camera.position.y = startY + (endY - startY) * scrollProgress;

  camera.lookAt(0, 0, 0);

  const rotY = scrollProgress * Math.PI * 0.15;
  if (uniformGroup) uniformGroup.rotation.y = rotY;
  if (annotationsGroup) annotationsGroup.rotation.y = rotY;

  requestAnimationFrame(updateScroll);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
