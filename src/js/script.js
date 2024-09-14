import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import sky from '../img/sky1.png'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';




//initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const orbit = new OrbitControls(camera, renderer.domElement)







//gltf loader
const loader = new GLTFLoader();
let flatearth;

loader.load(
  '/assets/flat_earth/scene.gltf',
  (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, 0);

    flatearth = gltf.scene;

    const textureLoader = new THREE.TextureLoader();
    const textures = {
      'Material.001_diffuse': textureLoader.load('/assets/flat_earth/textures/Material.001_diffuse.jpeg'),
      'Material.002_diffuse': textureLoader.load('/assets/flat_earth/textures/Material.002_diffuse.jpeg'),
      'Material.003_diffuse': textureLoader.load('/assets/flat_earth/textures/Material.003_diffuse.jpeg'),
      // Add more textures as needed
    };

    flatearth.traverse((child) => {
      if (child.isMesh && child.material) {
        const materialName = child.material.name;
        const textureName = `${materialName}_diffuse`;
        
        if (textures[textureName]) {
          child.material.map = textures[textureName];
          child.material.needsUpdate = true;
        }
      }
    });
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    console.error('An error happened', error);
  }
);


//light
const ambientLight = new THREE.AmbientLight('white')
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
scene.add(directionalLight);


const dlightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dlightHelper);

directionalLight.position.set(0, 60, 0)

//background
// renderer.setClearColor('yellow')

const txtLoader = new THREE.TextureLoader();
// scene.background= txtLoader.load(sky);

const cubeTxtLoader = new THREE.CubeTextureLoader();
scene.background = cubeTxtLoader.load([sky, sky, sky, sky, sky, sky]);

//
//camera
camera.position.z = 5;
camera.position.y = 5
camera.position.x = 5
orbit.update()

//animation
function animate() {
    if (flatearth) {
        flatearth.rotation.y += 0.009; 
    }


    renderer.render( scene, camera );
}