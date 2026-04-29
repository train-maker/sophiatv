import * as THREE from './assets/three.module.js';

const canvas = document.getElementById('earthGlobeCanvas');
const assetUrl = (path) => new URL(path, import.meta.url).href;

if (canvas) {
  const stage = canvas.closest('.transparent-globe-stage');
  const fallback = stage?.querySelector('.earth-globe-fallback');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  const group = new THREE.Group();
  group.rotation.z = -0.36;
  scene.add(group);

  const loader = new THREE.TextureLoader();
  const earthTexture = loader.load(assetUrl('./assets/earth_1024.jpg'));
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  earthTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  const earthPortraitTexture = loader.load(assetUrl('./assets/earth_orbital_camera_1024.png'));
  earthPortraitTexture.colorSpace = THREE.SRGBColorSpace;
  earthPortraitTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  const cloudTexture = loader.load(assetUrl('./assets/earth_clouds_512.png'));
  cloudTexture.colorSpace = THREE.SRGBColorSpace;
  cloudTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.62, 96, 96),
    new THREE.MeshPhongMaterial({
      map: earthTexture,
      transparent: true,
      opacity: 0.96,
      shininess: 74,
      specular: new THREE.Color(0x8fdcff),
    })
  );
  group.add(earth);

  const earthPortrait = new THREE.Mesh(
    new THREE.CircleGeometry(1.54, 160),
    new THREE.MeshBasicMaterial({
      map: earthPortraitTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
  );
  earthPortrait.position.z = 0.08;
  group.add(earthPortrait);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.66, 96, 96),
    new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(clouds);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.76, 96, 96),
    new THREE.MeshBasicMaterial({
      color: 0x71c9ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(atmosphere);

  const glassShell = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 96, 96),
    new THREE.MeshPhysicalMaterial({
      color: 0x9fe8ff,
      transparent: true,
      opacity: 0.035,
      roughness: 0.08,
      metalness: 0,
      transmission: 0.45,
      thickness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(glassShell);

  scene.add(new THREE.AmbientLight(0xffffff, 0.92));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-3.8, 2.8, 4.4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x4fd8ff, 1.2);
  rim.position.set(4.2, -1.2, -2.4);
  scene.add(rim);
  const lower = new THREE.PointLight(0x28ffb5, 0.42, 8);
  lower.position.set(0, -3.6, 2.8);
  scene.add(lower);

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const size = Math.max(240, Math.floor(Math.min(rect.width || 420, rect.height || 420)));
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  };

  let last = 0;
  const render = (time) => {
    const delta = last ? Math.min((time - last) / 1000, 0.05) : 0;
    last = time;
    group.rotation.y += delta * 0.42;
    earth.rotation.y += delta * 0.5;
    earthPortrait.rotation.z += delta * 0.018;
    clouds.rotation.y += delta * 0.72;
    glassShell.rotation.y -= delta * 0.14;
    canvas.dataset.rotation = String((Number(canvas.dataset.rotation || 0) + delta * 0.92).toFixed(3));
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  canvas.classList.add('is-ready');
  if (fallback) fallback.classList.add('is-hidden');
  requestAnimationFrame(render);
}
