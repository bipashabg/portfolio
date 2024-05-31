import './style.css';

import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render( scene, camera);

const geometry = new THREE.TubeGeometry( 10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xB5C0D0, wireframe: true});
const tube = new THREE.Mesh(geometry, material);

scene.add(tube);

function animate(){
  requestAnimationFrame( animate);
  tube.rotation.x += 0.01;
  tube.rotation.y +=0.005;
  tube.rotation.z +=0.01;
  
  renderer.render( scene, camera);
}

animate();

