import * as BABYLON from '@babylonjs/core';
import loadMeshes from './mesh';
import handleMeshHover from './event';
import renderUI from './ui';

// Get the canvas element from the DOM.
const canvas = document.getElementById('renderCanvas');

// Associate a Babylon Engine to it.
const engine = new BABYLON.Engine(canvas, true);
/**
 * Creates a new scene.
 * @returns {Promise<BABYLON.Scene>} The created scene.
 */

async function createScene() {
  const outlineValues = {
    color: new BABYLON.Color3(1.0, 0.0, 0.0),
    width: 2,
  };

  const updateValue = (key, value) => {
    outlineValues[key] = value;
  };

  // Create the scene space
  const scene = new BABYLON.Scene(engine);

  // Add light to the scene
  const light = new BABYLON.HemisphericLight("hemesphere", new BABYLON.Vector3(0, 1, 0), scene);
  light.specular = BABYLON.Color3.Black();

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  scene.createDefaultCamera(true, true, true);

  
  
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1, height: 1 }, scene);

  await loadMeshes(scene);

  handleMeshHover(scene, outlineValues);

  renderUI(updateValue);

  return scene;
}

const scene = createScene().then((scene) => {
  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(() => {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener('resize', () => {
    engine.resize();
  });
});
