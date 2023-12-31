import * as BABYLON from '@babylonjs/core';


// We are not going to render the outline for the ground mesh 
// or do any other operation on it
const EXCLUDED_MESHES = ['ground'];

// We are not using the default outline pattern here to render the outline
// i.e. rendering an outline mesh around the selected mesh but instead
// we are using a post process to render the outline
// This is because the default outline pattern would hide the outline
// ince the selected mesh is occluded by other meshes
// However this is a pattern that was not provided in the task example


const applySobelFilter = (defaultCamera,higlightTargets,orignalTargets,outlineValues) => {

  // Create a sobel filter post process
  // using the sobel shader
  // attach it to the default camera
  const sobelFilter = new BABYLON.PostProcess(
    'sobelEdgeDetection',
    './shaders/sobel',
    ['outlineColor', 'outlineWidth'],
    [ 'originalSampler','highlightedSampler'],
    1.0,
    defaultCamera
  );

  // Set the sobel filter to be the last post process to be run
  sobelFilter.onApply = function (effect) {

    // Set the highlighted scene render target as the highlighted sampler
    effect.setTexture('highlightedSampler', higlightTargets);
    // Set the original scene render target as the original sampler
    effect.setTextureFromPostProcess('originalSampler', orignalTargets);
    // Set the screen size
    effect.setFloat2("screenSize", sobelFilter.width, sobelFilter.height);
    // Set the outline color 
    effect.setFloat4(
      'outlineColor',
      outlineValues.color.r,
      outlineValues.color.g,
      outlineValues.color.b,
      1.0
    );
     // Set the outline width
    effect.setFloat('outlineWidth', outlineValues.width);
  };

}



// To render the out line we are going to do it in two passes

// First pass: Get the original scene and render it to a render target
// Second pass: Create a post process that will render the outline using the render target from the first pass


const customOutlineLayer = (scene,outlineValues) => {

    // Get the default rendering group

    const renderEngine = scene.getEngine();
    const defaultCamera = scene.cameras[0];

    // Handle render Targets for the original scene and the highlighted scene

    const renderTargets = new BABYLON.RenderTargetTexture(
      'outlineTargets',
      { ratio: renderEngine.getRenderWidth() / renderEngine.getRenderHeight() },
      scene
    );


    // Original Scene Render Targets 
    // A one time pass to render the original scene to a render target
    const ogTargets = new BABYLON.DisplayPassPostProcess(
        'displayRenderTarget',
        1.0,
        defaultCamera
      );



    // Apply the sobel filter to the render targets
    applySobelFilter(defaultCamera,renderTargets,ogTargets,outlineValues);


    scene.customRenderTargets.push(renderTargets);




    const addMesh = (mesh) => {
      if (!renderTargets.renderList.includes(mesh)) {
        renderTargets.renderList.push(mesh);
      }
    };
  
    const removeMesh = (mesh) => {
      if (renderTargets.renderList.includes(mesh)) {
        mesh.material = mesh.ogMaterial;
        renderTargets.renderList = renderTargets.renderList.filter((m) => m !== mesh);
      }
    };
  
    const emptyTargets = () => {
      renderTargets.renderList = [];
    }
  
    return {
      renderTargets,
      addMesh,
      removeMesh,
      emptyTargets
    };
  };
  


function checkHoveredMesh(scene,hoverCallback) {

  // Add event listeners to the meshes to handle hover events

  // Upon the pointer event we will call the hoverCallback function with the current hovered mesh
    
  scene.meshes.forEach(mesh => {
    mesh.actionManager = new BABYLON.ActionManager(scene);
    mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        () => {
            if (EXCLUDED_MESHES.includes(mesh.name)) return;
            hoverCallback(mesh,scene);
        }
        )
    );
    mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        () => {
           if (EXCLUDED_MESHES.includes(mesh.name)) return;
           hoverCallback(null,scene); 
        }
        )
    );
});



}




function handleMeshHover(scene,outlineValues) {

  const outlineLayer = customOutlineLayer(scene,outlineValues);

  const onHoverCallback=(currentHoveredMesh)=>{
      if (currentHoveredMesh) {
          outlineLayer.addMesh(currentHoveredMesh);
      }
      else{
          outlineLayer.emptyTargets();
      }
  }

  checkHoveredMesh(scene,onHoverCallback);

}


export default handleMeshHover;