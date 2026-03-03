import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { initI18n } from './i18n.js';
import { initTextRotator } from './text-rotator.js';
import { initGridRoom } from './grid-room.js';

let scene, camera, renderer, poloShirt;
let wireframeVersion;
let scrollProgress = 0;
let currentSection = 0;

const SECTIONS = {
  HERO: 0,
  TECH: 1,
  WIREFRAME: 2,
  SERVICES: 3,
  PROCESS: 4,
  CONTACT: 5
};

function init() {
  const container = document.getElementById('canvas-container');

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x045218, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0x045218, 0.4);
  backLight.position.set(-5, -5, -5);
  scene.add(backLight);

  createPoloShirt();

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('scroll', onScroll);

  animate();
}

function createPoloShirt() {
  const geometry = new THREE.BoxGeometry(1.2, 1.5, 0.3);
  const material = new THREE.MeshStandardMaterial({
    color: 0x045218,
    metalness: 0.3,
    roughness: 0.4,
    emissive: 0x045218,
    emissiveIntensity: 0.1
  });

  poloShirt = new THREE.Group();

  const body = new THREE.Mesh(geometry, material);
  poloShirt.add(body);

  const collarGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.35);
  const collar = new THREE.Mesh(collarGeometry, material);
  collar.position.y = 0.65;
  poloShirt.add(collar);

  const leftSleeveGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.3);
  const leftSleeve = new THREE.Mesh(leftSleeveGeometry, material);
  leftSleeve.position.set(-0.8, 0.3, 0);
  leftSleeve.rotation.z = 0.3;
  poloShirt.add(leftSleeve);

  const rightSleeve = new THREE.Mesh(leftSleeveGeometry, material);
  rightSleeve.position.set(0.8, 0.3, 0);
  rightSleeve.rotation.z = -0.3;
  poloShirt.add(rightSleeve);

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x045218,
    wireframe: true,
    transparent: true,
    opacity: 0
  });

  wireframeVersion = new THREE.Group();

  const bodyWireframe = new THREE.Mesh(geometry, wireframeMaterial);
  wireframeVersion.add(bodyWireframe);

  const collarWireframe = new THREE.Mesh(collarGeometry, wireframeMaterial);
  collarWireframe.position.y = 0.65;
  wireframeVersion.add(collarWireframe);

  const leftSleeveWireframe = new THREE.Mesh(leftSleeveGeometry, wireframeMaterial);
  leftSleeveWireframe.position.set(-0.8, 0.3, 0);
  leftSleeveWireframe.rotation.z = 0.3;
  wireframeVersion.add(leftSleeveWireframe);

  const rightSleeveWireframe = new THREE.Mesh(leftSleeveGeometry, wireframeMaterial);
  rightSleeveWireframe.position.set(0.8, 0.3, 0);
  rightSleeveWireframe.rotation.z = -0.3;
  wireframeVersion.add(rightSleeveWireframe);

  poloShirt.position.x = 2;
  wireframeVersion.position.x = 2;

  scene.add(poloShirt);
  scene.add(wireframeVersion);
}

function onScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = scrollTop / docHeight;

  const sectionHeight = 1 / 6;
  currentSection = Math.floor(scrollProgress / sectionHeight);
  const sectionProgress = (scrollProgress % sectionHeight) / sectionHeight;

  updateShirtAnimation(currentSection, sectionProgress);
}

function updateShirtAnimation(section, progress) {
  if (!poloShirt || !wireframeVersion) return;

  switch(section) {
    case SECTIONS.HERO:
      poloShirt.rotation.y = progress * Math.PI * 0.5;
      poloShirt.position.y = Math.sin(progress * Math.PI) * 0.3;
      poloShirt.scale.setScalar(1);

      poloShirt.children.forEach((child, index) => {
        if (child.material && !child.material.wireframe) {
          child.material.opacity = 1;
          child.material.transparent = false;
        }
      });
      wireframeVersion.children.forEach(child => {
        if (child.material) {
          child.material.opacity = 0;
        }
      });
      break;

    case SECTIONS.TECH:
      poloShirt.rotation.y = Math.PI * 0.5 + progress * Math.PI * 0.5;
      poloShirt.position.y = 0.3 - progress * 0.3;
      poloShirt.scale.setScalar(1 + progress * 0.2);

      poloShirt.children.forEach(child => {
        if (child.material && !child.material.wireframe) {
          child.material.opacity = 1;
          child.material.transparent = false;
        }
      });
      wireframeVersion.children.forEach(child => {
        if (child.material) {
          child.material.opacity = 0;
        }
      });
      break;

    case SECTIONS.WIREFRAME:
      poloShirt.rotation.y = Math.PI + progress * Math.PI * 0.5;
      poloShirt.position.y = 0;

      const fadeProgress = Math.min(progress * 2, 1);
      poloShirt.children.forEach(child => {
        if (child.material && !child.material.wireframe) {
          child.material.opacity = 1 - fadeProgress;
          child.material.transparent = true;
        }
      });

      wireframeVersion.rotation.y = poloShirt.rotation.y;
      wireframeVersion.position.y = poloShirt.position.y;
      wireframeVersion.scale.copy(poloShirt.scale);
      wireframeVersion.children.forEach(child => {
        if (child.material) {
          child.material.opacity = fadeProgress;
        }
      });

      if (progress > 0.5) {
        const explosionProgress = (progress - 0.5) * 2;
        wireframeVersion.children.forEach((child, index) => {
          if (index === 0) {
            child.position.z = explosionProgress * 0.5;
          } else if (index === 1) {
            child.position.y = 0.65 + explosionProgress * 0.3;
          } else if (index === 2) {
            child.position.x = -0.8 - explosionProgress * 0.3;
          } else if (index === 3) {
            child.position.x = 0.8 + explosionProgress * 0.3;
          }
        });
      } else {
        wireframeVersion.children[0].position.z = 0;
        wireframeVersion.children[1].position.y = 0.65;
        wireframeVersion.children[2].position.x = -0.8;
        wireframeVersion.children[3].position.x = 0.8;
      }
      break;

    case SECTIONS.SERVICES:
      poloShirt.rotation.y = Math.PI * 1.5 + progress * Math.PI * 0.3;
      poloShirt.position.y = -progress * 0.5;

      poloShirt.children.forEach(child => {
        if (child.material && !child.material.wireframe) {
          child.material.opacity = progress;
          child.material.transparent = true;
        }
      });

      wireframeVersion.rotation.y = poloShirt.rotation.y;
      wireframeVersion.position.y = poloShirt.position.y;
      wireframeVersion.children.forEach(child => {
        if (child.material) {
          child.material.opacity = 1 - progress;
        }
        child.position.z = 0;
        child.position.y = child === wireframeVersion.children[1] ? 0.65 : 0;
        child.position.x = child === wireframeVersion.children[2] ? -0.8 :
                          child === wireframeVersion.children[3] ? 0.8 : 0;
      });
      break;

    case SECTIONS.PROCESS:
      poloShirt.rotation.y = Math.PI * 1.8 + progress * Math.PI * 0.2;
      poloShirt.position.y = -0.5 - progress * 0.3;
      poloShirt.scale.setScalar(1.2 - progress * 0.2);

      poloShirt.children.forEach(child => {
        if (child.material && !child.material.wireframe) {
          child.material.opacity = 1;
          child.material.transparent = false;
        }
      });
      wireframeVersion.children.forEach(child => {
        if (child.material) {
          child.material.opacity = 0;
        }
      });
      break;

    case SECTIONS.CONTACT:
      poloShirt.rotation.y = Math.PI * 2;
      poloShirt.position.y = -0.8 - progress * 0.5;
      poloShirt.scale.setScalar(1 - progress * 0.5);

      poloShirt.children.forEach(child => {
        if (child.material && !child.material.wireframe) {
          child.material.opacity = Math.max(0, 1 - progress);
          child.material.transparent = true;
        }
      });
      wireframeVersion.children.forEach(child => {
        if (child.material) {
          child.material.opacity = 0;
        }
      });
      break;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (poloShirt) {
    poloShirt.rotation.y += 0.002;
  }
  if (wireframeVersion) {
    wireframeVersion.rotation.y = poloShirt.rotation.y;
  }

  renderer.render(scene, camera);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    initI18n();
    initTextRotator();
    initGridRoom();
  });
} else {
  init();
  initI18n();
  initTextRotator();
  initUniformWireframe();
}

const techItems = document.querySelectorAll('[data-tech-item]');
if (techItems.length) {
  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        techObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  techItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
    techObserver.observe(item);
  });

  const techSection = document.getElementById('tecnologia');
  const barDelays = [0.0, 0.12, 0.28];
  const barRanges = [0.6, 0.55, 0.5];
  const minFontSize = 1.2;
  const maxFontSize = 3.5;
  function updateTechLines() {
    if (techSection) {
      const sectionRect = techSection.getBoundingClientRect();
      const windowH = window.innerHeight;
      const rawProgress = (windowH - sectionRect.top) / (windowH + sectionRect.height * 0.5);
      const sectionProgress = Math.min(Math.max(rawProgress, 0), 1);

      techItems.forEach((item, index) => {
        const lineFill = item.querySelector('.tech-item-line-fill');
        const percentEl = item.querySelector('.tech-item-percent');
        if (!lineFill) return;
        const delay = barDelays[index];
        const range = barRanges[index];
        const itemProgress = Math.min(Math.max((sectionProgress - delay) / range, 0), 1);
        const pct = Math.round(itemProgress * 100);
        lineFill.style.width = `${pct}%`;
        if (percentEl) {
          percentEl.textContent = `${pct}%`;
          const fontSize = minFontSize + (maxFontSize - minFontSize) * itemProgress;
          percentEl.style.fontSize = `${fontSize}rem`;
        }
      });
    }
    requestAnimationFrame(updateTechLines);
  }
  updateTechLines();
}


const wireframeSection = document.getElementById('wireframe');
const poloClipRect = document.getElementById('poloClipRect');
if (wireframeSection && poloClipRect) {
  function updatePoloReveal() {
    const rect = wireframeSection.getBoundingClientRect();
    const wh = window.innerHeight;
    const raw = (wh - rect.top) / (wh + rect.height * 0.4);
    const progress = Math.min(Math.max(raw, 0), 1);
    const revealWidth = progress * 400;
    poloClipRect.setAttribute('width', String(revealWidth));
    requestAnimationFrame(updatePoloReveal);
  }
  updatePoloReveal();
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
