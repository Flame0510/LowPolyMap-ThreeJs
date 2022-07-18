import "./style.scss";
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

import { cameraSetup } from "./js/camera";

// Debug
const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//GLTFLoader
const loader = new GLTFLoader();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({ color: "#fff" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -1;
//scene.add(floor);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const { camera, controls } = cameraSetup(sizes, canvas, scene);

const floorFolder = gui.addFolder("Cube");
floorFolder.add(floor.rotation, "x", -10, 10);
floorFolder.add(floor.rotation, "y", -10, 10);
floorFolder.add(floor.rotation, "z", -10, 10);
floorFolder.open();

let blackboard;

loader.load("models/map.glb", (glb) => {
  const map = glb.scene;

  map.traverse((el) => {
    const { name } = el;
    el.castShadow = true;

    name === "BlackBoard" && (blackboard = el);

    name.includes("Island") && (el.receiveShadow = true);
  });

  scene.add(map);
});

const light = new THREE.AmbientLight("#fff", 1);
//light.castShadow = true;
scene.add(light);

const directionalLight = new THREE.DirectionalLight("#fff", 1);
directionalLight.position.set(-2, 5, -2);
directionalLight.castShadow = true;
scene.add(directionalLight);

const lightFolder = gui.addFolder("Light");
lightFolder.add(directionalLight.position, "x", -10, 10);
lightFolder.add(directionalLight.position, "y", -10, 10);
lightFolder.add(directionalLight.position, "z", -10, 10);
lightFolder.open();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("lightblue");
renderer.shadowMap.enabled = true;
//renderer.physicallyCorrectLights = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  blackboard && (blackboard.position.y = Math.sin(elapsedTime) + 2);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
