import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshNormalMaterial({ color: 0xB6FFFA });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

/*
const LightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(LightHelper, gridHelper);
*/

const controls = new OrbitControls(camera, renderer.domElement);

function addHolographicStar() {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vUv; 
      void main() {
        vUv = position; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 baseColor;
      uniform vec3 holographicColor1;
      uniform vec3 holographicColor2;
      varying vec3 vUv;
      void main() {
        float t = abs(sin(time + vUv.x * 10.0)) * 0.5 + 0.5;
        vec3 holographicColor = mix(holographicColor1, holographicColor2, t);
        vec3 finalColor = mix(baseColor, holographicColor, 0.5);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    uniforms: {
      time: { value: 1.0 },
      baseColor: { value: new THREE.Color(0xACFADF) },  // Base color
      holographicColor1: { value: new THREE.Color(0xA084E8) },  // First holographic color
      holographicColor2: { value: new THREE.Color(0xFFFFFF) }   // Second holographic color
    }
  });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);

  // Save the star material for updating in the animation loop
  holographicStars.push(starMaterial);
}

const holographicStars = [];
Array(200).fill().forEach(addHolographicStar);

const bgTexture = new THREE.TextureLoader().load('bg.jpg');
scene.background = bgTexture;

// Avatar
const pfpTexture = new THREE.TextureLoader().load('pfp.jpeg');
const pfp = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: pfpTexture })
);
scene.add(pfp);

//sphere
const backTexture = new THREE.TextureLoader().load('back.jpeg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshNormalMaterial({
    map: backTexture,
    normalMap: normalTexture
  })
);

scene.add(sphere);

sphere.position.z = 30;
sphere.position.setX(-10);



function moveCamera(){

  const t = document.body.getBoundingClientRect().top;
  sphere.rotation.x += 0.05;
  sphere.rotation.y += 0.075;
  sphere.rotation.z += 0.05;

  pfp.rotation.y += 0.01;
  pfp.rotation.z +=0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}

document.body.onscroll = moveCamera

document.body.onscroll = moveCamera

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // Update star materials
  holographicStars.forEach(starMaterial => {
    starMaterial.uniforms.time.value += 0.05;
  });

  controls.update();

  renderer.render(scene, camera);
}

animate();

