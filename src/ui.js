
import * as GUI from '@babylonjs/gui';

function renderUI(updateValue) {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("highlightUI");
    advancedTexture.isForeground = true;

    const controlPanel = new GUI.StackPanel();
    controlPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    controlPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    controlPanel.paddingTop = "10px";
    controlPanel.width = "220px";

    // Create a color wheel
    const colorWheel = new GUI.ColorPicker("OutlineColor");
    colorWheel.width = "200px";
    colorWheel.height = "200px";
    colorWheel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    colorWheel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    colorWheel.onValueChangedObservable.add(function(value) {
        // Handle color wheel value change
        updateValue('color', value);
    });
    controlPanel.addControl(colorWheel);

    // Create a slider
    const slider = new GUI.Slider("OutlineWidth");
    slider.minimum = 2;
    slider.maximum = 70;
    slider.step = 10;
    slider.value = 3;
    slider.width = "200px";
    slider.height = "20px";
    slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    slider.onValueChangedObservable.add(function(value) {
        // Handle slider value change
        updateValue('width', value);
    });
    controlPanel.addControl(slider);

    // Render the scene

    // Position the color wheel
    advancedTexture.addControl(controlPanel);
}

export default renderUI;