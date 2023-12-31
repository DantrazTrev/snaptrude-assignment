import * as BABYLON from '@babylonjs/core';

const EXCLUDED_MESHES = ['ground'];

// We are not using the default outline pattern here to render the outline
// i.e. rendering an outline mesh around the selected mesh but instead
// we are using a post process to render the outline
// This is because the default outline pattern would hide the outline
// ince the selected mesh is occluded by other meshes
// However this is a pattern that was not provided in the task example

const customOutlineLayer = (scene,outlineValues) => {
    const renderEngine = scene.getEngine();
    const defaultCamera = scene.cameras[0];
  
    const renderTargets = new BABYLON.RenderTargetTexture(
      'outlineTargets',
      { ratio: renderEngine.getRenderWidth() / renderEngine.getRenderHeight() },
      scene
    );

    const ogTargets = new BABYLON.DisplayPassPostProcess(
        'displayRenderTarget',
        1.0,
        defaultCamera
      );

 const sobelFilter = new BABYLON.PostProcess(
        'sobelEdgeDetection',
        './shaders/outline',
        ['outlineColor', 'outlineWidth'],
        [ 'originalSampler','highlightedSampler'],
        1.0,
        defaultCamera
      );

  sobelFilter.onApply = function (effect) {
        effect.setTexture('highlightedSampler', renderTargets);
        effect.setTextureFromPostProcess('originalSampler', ogTargets);
        effect.setFloat2("screenSize", sobelFilter.width, sobelFilter.height);
          effect.setFloat4(
          'outlineColor',
          outlineValues.color.r,
          outlineValues.color.g,
          outlineValues.color.b,
          1.0
        );
        effect.setFloat('outlineWidth', outlineValues.width);
      };

  // Blur for edge smoothing
  const blurH = new BABYLON.BlurPostProcess(
        'blurH',
        new BABYLON.Vector2(1, 0),
        1.0,
        1.0,
        defaultCamera
      );
  const blurV = new BABYLON.BlurPostProcess(
        'blurV',
        new BABYLON.Vector2(0, 1),
        1.0,
        1.0,
        defaultCamera
      );    
  
   


    const addMesh = (mesh) => {
      if (!mesh.ogMaterial) {
        mesh.ogMaterial = mesh.material;
      }
      console.log(renderTargets.renderList);
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
  
    scene.customRenderTargets.push(renderTargets);
  
    return {
      renderTargets,
      addMesh,
      removeMesh,
      emptyTargets: () => {
        renderTargets.renderList.forEach((mesh) => {
          mesh.material = mesh.ogMaterial;
        });
        renderTargets.renderList = [];
      },
    };
  };
  
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




function checkHoveredMesh(scene,hoverCallback) {
    
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



export default handleMeshHover;