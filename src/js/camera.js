import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const cameraSetup = (sizes, canvas, scene) => {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.x = 0;
  camera.position.y = 20;
  camera.position.z = 10;

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
  //controls.enableRotate = false;

  controls.maxPolarAngle = 0.98;
  controls.minPolarAngle = 0.98;

  return { camera, controls };
};
