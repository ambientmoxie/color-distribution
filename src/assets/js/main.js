import "../scss/style.scss";
import p5 from "p5";
import { Pane } from "tweakpane";
import {
  defaultConfig,
  COLORS,
  RATIO,
  SPREAD,
  GRID,
  SEED,
} from "./defaultConfig";

function sketch(p) {
  let currentColor;
  let canvasSizeH;
  let canvasSizeW;

  // * -----------------------------------------------
  // * Init TweekPane
  // * -----------------------------------------------

  function initTweek() {
    const pane = new Pane();

    // Add color folder
    const colorsFolder = pane.addFolder({
      title: "Colors",
    });

    // Add each color
    Object.keys(COLORS).forEach((key, index) => {
      colorsFolder.addBinding(COLORS, key, {
        label: `color ${index + 1}`,
      });
    });

    // Canvas folder. Contains property like : ratio, spread, division and seed
    const canvasFolder = pane.addFolder({
      title: "Canvas",
    });

    // Bind ratio
    canvasFolder.addBinding(RATIO, "ratio", {
      options: {
        square: "square",
        portrait: "portrait",
        landscape: "landscape",
      },
    });

    // Bind spread
    canvasFolder.addBinding(SPREAD, "spread", {
      options: {
        vertical: "vertical",
        horizontal: "horizontal",
        noise: "noise",
      },
    });

    // Bind division
    canvasFolder.addBinding(GRID, "division", {
      min: 10,
      max: 100,
      step: 20,
    });

    // Bind seed
    canvasFolder.addBinding(SEED, "seed", {
      min: 0,
      max: 1,
    });

    // Shuffle button
    pane.addButton({ title: "Shuffle" }).on("click", applySettings);

    // Download button
    pane.addButton({ title: "Download" }).on("click", saveCurrentCanvas);

    pane.on("change", applySettings);
  }

  function setRatio() {
    if (RATIO.ratio == "landscape") {
      canvasSizeW = 600;
      canvasSizeH = 400;
    } else if (RATIO.ratio == "portrait") {
      canvasSizeW = 400;
      canvasSizeH = 600;
    } else {
      canvasSizeW = 600;
      canvasSizeH = 600;
    }
  }

  /*

  * -----------------------------------------------
  * Function Apply Settings
  * -----------------------------------------------

  This function redefines the width and height of the canvas based on the new values set by the user.
  It redraws the grid, resulting in a new distribution of colors.

  */

  function applySettings() {
    setRatio();
    p.resizeCanvas(canvasSizeW, canvasSizeH);
    drawGrid(p, GRID.division);
  }

  /*

  * -----------------------------------------------
  * Function Get Random Color
  * -----------------------------------------------

  This function defines a random index and applies it to the color palette.
  LSS: Returns a random color.

  */

  function getRandomColor() {
    const keys = Object.keys(COLORS);
    const randomKey = keys[p.int(p.random(keys.length))];
    return COLORS[randomKey];
  }

  function drawGrid(p, amount) {
    const w = p.width / amount;
    const h = w;

    let x, y;

    // Loop ranges

    const largerRange = SPREAD.spread == "horizontal" ? amount * 2 : amount;
    const smallerRange = SPREAD.spread == "horizontal" ? amount : amount * 2;

    for (let i = 0; i < largerRange; i++) {
      for (let j = 0; j < smallerRange; j++) {
        // Determine color based on spread type
        if (SPREAD.spread === "horizontal" || SPREAD.spread === "vertical") {
          if (p.random(1) < SEED.seed) {
            currentColor = getRandomColor();
          }
        } else if (SPREAD.spread === "noise") {
          // Noise-based color change
          let noiseFactor = p.noise(j * 0.1, i * 0.1);
          if (noiseFactor < SEED.seed) {
            currentColor = getRandomColor();
          }
        }

        // Determine x and y positions based on spread

        x = SPREAD.spread == "horizontal" ? j : i;
        y = SPREAD.spread == "horizontal" ? i : j;

        // Draw the rectangle
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
    setRatio();
    const cnv = p.createCanvas(canvasSizeW, canvasSizeH);
    cnv.parent(document.body);
    cnv.id("p5-cnv");

    p.background(...defaultConfig.bgColor);
    currentColor = getRandomColor();
    drawGrid(p, GRID.division);

    initTweek();
  };
}

new p5(sketch);
