
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


const addMeshes = async (scene) => {

  const material = new BABYLON.StandardMaterial('material', scene);
  material.disableLighting = true;
  
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 ,roughness:0.7}, scene);
  sphere.position.y = 0.05;
  sphere.position.x = 0.4;
  sphere.material = new BABYLON.StandardMaterial('material', scene);
  material.disableLighting = true;
  sphere.material.disableLighting = true; 
  sphere.material.emissiveColor = randomColor();

  const box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.2 }, scene);
  box.position.y = 0.1;
  box.position.x = -0.1;
  box.material = new BABYLON.StandardMaterial('material', scene);
  box.material.disableLighting = true;
  box.material.emissiveColor = randomColor();

  const torus = BABYLON.MeshBuilder.CreateTorus("torus", { diameter: 0.2, thickness: 0.05, }, scene);
  torus.position.y = 0.23;
  torus.position.x = -0.1;
  torus.material = box.material;
  torus.material.disableLighting = true;
  torus.material.emissiveColor = randomColor();

  const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { diameter: 0.15, height: 0.2, tessellation: 6 }, scene);
  cylinder.position.y = 0.1;
  cylinder.position.x = 0.2;
  cylinder.position.z = 0.2
  cylinder.material = new BABYLON.StandardMaterial('material', scene);
  cylinder.material.disableLighting = true;

  cylinder.material.emissiveColor = randomColor();

  try {
    const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '/', 'cat.obj', scene);
    const mesh = meshes.meshes[0];
    const material = new BABYLON.StandardMaterial('cat', scene);
    
    material.diffuseColor = new BABYLON.Color3(0.6, -0.2, 0.2);
    
    material.albedoColor = new BABYLON.Color3(1, 1, 1); // Base color
    
    
    mesh.material = material;
    mesh.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    mesh.position.y = 0.01;
    mesh.position.x = 0.2;
  } catch (err) {
    console.log('Error while loading the obj file: ', err);
  }
}

export default addMeshes;