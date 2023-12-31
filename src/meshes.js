
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';


const COLOR_ARRAY = [
  new BABYLON.Color3(0.1, 0.5, 0.2),
  new BABYLON.Color3(0.2, 0.2, 0.5),
  new BABYLON.Color3(0.2, 0.2, 0.4),
  new BABYLON.Color3(0.6, -0.2, 0.2),
  new BABYLON.Color3(0.5, 0.2, 0.4),
]

const randomColor = () => {
  const index = Math.floor(Math.random() * COLOR_ARRAY.length);
  return COLOR_ARRAY[index];
}


const createMaterial = (scene,id) => {

  if(!scene){
    throw new Error('No scene provided')
  }

  if(!id){
     id = uuid()
  }

  const material = new BABYLON.StandardMaterial(id, scene);
  material.emissiveColor = randomColor();
  return material;
}


/**
 * Adds meshes to the scene.
 * 
 * @param {BABYLON.Scene} scene - The scene to add the meshes to.
 * @returns {Promise<void>} - A promise that resolves when the meshes are added.
 */
const addMeshes = async (scene) => {


  if(!scene){
    throw new Error('No scene provided')
  }

  // Create a sphere

  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 ,roughness:0.7}, scene);
  sphere.position.y = 0.05;
  sphere.position.x = 0.4;
  sphere.material = createMaterial(scene,'sphereMaterial');


  // Create a box


  const box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.2 }, scene);
  box.position.y = 0.1;
  box.position.x = -0.1;
  box.material = createMaterial(scene,'boxMaterial');


  // Create a torus


  const torus = BABYLON.MeshBuilder.CreateTorus("torus", { diameter: 0.2, thickness: 0.05, }, scene);
  torus.position.y = 0.23;
  torus.position.x = -0.1;
  torus.material = createMaterial(scene,'torusMaterial');


  // Create a cylinder

  const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { diameter: 0.15, height: 0.2, tessellation: 6 }, scene);
  cylinder.position.y = 0.1;
  cylinder.position.x = 0.2;
  cylinder.position.z = 0.2
  cylinder.material = createMaterial(scene,'cylinderMaterial');


  // Try to load an obj file
  try {
    const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/', 'cat.obj', scene);
    const mesh = meshes.meshes[0];
    
    mesh.material = createMaterial(scene,'catMaterial');

    mesh.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    mesh.position.y = 0.01;
    mesh.position.x = 0.2;
  } catch (err) {
    console.log('Error while loading the obj file: ', err);
  }
}

export default addMeshes;