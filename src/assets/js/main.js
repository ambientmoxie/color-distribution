import "../scss/style.scss";
import p5 from "p5";
import * as dat from "dat.gui";
import { defaultConfig } from "./defaultConfig";

function sketch(p) {
  let currentColor;
  let canvasSizeH;
  let canvasSizeW;

  /*

    ! Rappel du fonctionnement de la GUI :

    Structure: gui.add(object, "property", 0, 1).name("foo").onChange(callbackFunction);

    object: This is the object that contains the properties that will be controlled by the GUI.
    "property": This is the property of the object that the GUI will control.
    .name("foo"): Allows to give a name to the controller.
    .onChange(callbackFunction): Defines a callback function that will be executed with each detected change.

    ! API : https://github.com/dataarts/dat.gui/blob/master/API.md

    */

  function initGUI() {
    const gui = new dat.GUI();

    // * ------------------------------------------
    // * Dossier couleurs
    // * ------------------------------------------

    const colorsFolder = gui.addFolder("Colors");
    for (let i = 0; i < defaultConfig.colors.length; i++) {
      colorsFolder
        .addColor(defaultConfig.colors, i)
        .onChange(applySettings)
        .name("Color " + (i + 1));
    }
    colorsFolder.open();

    // * ------------------------------------------
    // * Dossier dimensions
    // * ------------------------------------------

    const dimFolder = gui.addFolder("Dimensions");
    for (let i = 0; i < defaultConfig.dimensions.length; i++) {
      let key = Object.keys(defaultConfig.dimensions[i])[0];
      dimFolder
        .add(defaultConfig.dimensions[i], key, 0.1, 1)
        .onChange(applySettings);
    }
    dimFolder.open();

    // * ------------------------------------------
    // * Dossier utilities
    // * ------------------------------------------

    const utils = gui.addFolder("Utils");

    utils
      .add(defaultConfig, "seed", 0.01, 0.5)
      .name("Seed")
      .onChange(applySettings);

    utils
      .add({ applyChanges: applySettings }, "applyChanges")
      .name("Create Composition");

    utils
      .add({ saveCanvas: saveCurrentCanvas }, "saveCanvas")
      .name("Save Canvas");

    utils.open();
  }

  /*

  * -----------------------------------------------
  * Function Apply Settings
  * -----------------------------------------------

  This function redefines the width and height of the canvas based on the new values set by the user.
  It redraws the grid, resulting in a new distribution of colors.

  */

  function applySettings() {
    canvasSizeH = window.innerHeight * defaultConfig.dimensions[1].Height;
    canvasSizeW = window.innerWidth * defaultConfig.dimensions[0].Width;
    p.resizeCanvas(canvasSizeW, canvasSizeH);
    drawGrid(p, defaultConfig.gridSize);
  }

  /*

  * -----------------------------------------------
  * Function Get Random Color
  * -----------------------------------------------

  This function defines a random index and applies it to the color palette.
  LSS: Returns a random color.

  */

  function getRandomColor() {
    const index = p.int(p.random(defaultConfig.colors.length));
    return defaultConfig.colors[index];
  }

  function drawGrid(p, amount) {
    const w = p.width / amount;
    const h = p.height / amount;

    for (let y = 0; y < amount; y++) {
      for (let x = 0; x < amount; x++) {
        if (p.random(1) < defaultConfig.seed) {
          currentColor = getRandomColor();
        }
        p.stroke(currentColor);
        p.fill(currentColor);
        p.rect(w * x, h * y, w, h);
      }
    }
  }

  /*

  * -----------------------------------------------
  * Function Save Current Canvas
  * -----------------------------------------------

  Save the composition

  */

  function saveCurrentCanvas() {
    p.saveCanvas("kawano-artwork", "png");
  }

  /*

  * -----------------------------------------------
  * Function Setup
  * -----------------------------------------------

  Dessine le canvas par default, cette fonction définie : 
  La densition de pixel (la résolution de la compostion pour une image téléchargée de bonne qualité).
  La largeur et la hauteur du canvas.
  Définie une couleur alétaoire pour la première boucle.
  Dessine la grille et applique les couleurs.
  Initialise la GUI.

  */

  p.setup = () => {
    p.pixelDensity(5);
    canvasSizeH = window.innerHeight * defaultConfig.dimensions[1].Height;
    canvasSizeW = window.innerWidth * defaultConfig.dimensions[0].Width;
    const cnv = p.createCanvas(canvasSizeW, canvasSizeH);
    cnv.parent(document.body);
    cnv.id("p5-cnv");

    p.background(...defaultConfig.bgColor);
    currentColor = getRandomColor();
    drawGrid(p, defaultConfig.gridSize);

    initGUI();
  };

  /*

  * -----------------------------------------------
  * Function Apply Settings
  * -----------------------------------------------

  Redraws a new composition if the dimensions of the browser window change.

  */

  p.windowResized = () => {
    canvasSizeH = window.innerHeight * defaultConfig.dimensions[1].Height;
    canvasSizeW = window.innerWidth * defaultConfig.dimensions[0].Width;
    p.resizeCanvas(canvasSizeW, canvasSizeH);
    p.background(...defaultConfig.bgColor);
    drawGrid(p, defaultConfig.gridSize);
  };
}

new p5(sketch);


/*

 & -----------------------------------------------
 & TODO
 & -----------------------------------------------

 - Horizontal distribution
 - Noise distibution

 */