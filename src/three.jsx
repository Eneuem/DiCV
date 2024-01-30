import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import * as CANNON from 'cannon-es';

const ThreeScene = () => {
  const sceneRef = useRef();

  useEffect(() => {
    const loader = new FontLoader();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

// Tableaux pour stocker les textMesh et les liens correspondants
const textMeshes = [];
const links = [
  'https://www.cryptobel.org',
  'https://www.schoolprojects.com',
  'https://www.drugstorebxl.com',
  'https://www.eneuem.xyz/',
  'https://github.com/Eneuem/',
  'https://www.skills.com'
];

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Dice creation
const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);

const materials = [
  new THREE.MeshPhysicalMaterial({ color: 0xffede1 }),
  new THREE.MeshPhysicalMaterial({ color: 0xF9FBF2 }),
  new THREE.MeshPhysicalMaterial({ color: 0xD7F9FF }),
  new THREE.MeshPhysicalMaterial({ color: 0xAFCBFF }),
  new THREE.MeshPhysicalMaterial({ color: 0xAFCBFF }),
  new THREE.MeshPhysicalMaterial({ color: 0x0E1C36 })
];
const dice = new THREE.Mesh(geometry, materials);
dice.castShadow = true;
scene.add(dice);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(0, 1, 1);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Camera position
camera.position.z = 5;

// Fonction pour créer un textMesh et le lier à un lien
function createTextMesh(text, position, rotation, link) {
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 0.20,
      height: 0.1
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.copy(position);
    textMesh.rotation.copy(rotation);
    scene.add(textMesh);

    textMeshes.push(textMesh);

    textMesh.userData.link = link; // Stocker le lien dans les données de l'objet
  });
}

// Créez les textMesh et les liez aux liens ici
createTextMesh('Cryptobel.org', new THREE.Vector3(-1, 0.8, 1.25 - 0.07), new THREE.Euler(0, 0, 0), links[0]);
createTextMesh('School projects', new THREE.Vector3(1, 0.8, -1.25 + 0.07), new THREE.Euler(0, Math.PI, 0), links[1]);
createTextMesh('Drugstore BXL', new THREE.Vector3(-0.8, 1.25 - 0.07, -0.8), new THREE.Euler(-Math.PI / 2, 0, 0), links[2]);
createTextMesh('eneuem.xyz', new THREE.Vector3(-0.7, -1.25 + 0.07, 0.8), new THREE.Euler(Math.PI / 2, 0, 0), links[3]);
createTextMesh('Github', new THREE.Vector3(1.25 - 0.07, 0.8, 1), new THREE.Euler(0, Math.PI / 2, 0), links[4]);
createTextMesh('Skills', new THREE.Vector3(-1.25 + 0.07, 0.8, -1), new THREE.Euler(0, -Math.PI / 2, 0), links[5]);

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(textMeshes);

  for (let i = 0; i < intersects.length; i++) {
    const intersect = intersects[i];
    const link = intersect.object.userData.link;
    if (link) {
      window.open(link, '_blank');
      break;
    }
  }
}

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    renderer.domElement.addEventListener('click', onMouseClick);

    return () => {
      // Clean up any resources (e.g., remove event listeners) when the component unmounts
      renderer.domElement.removeEventListener('click', onMouseClick);
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default ThreeScene;
