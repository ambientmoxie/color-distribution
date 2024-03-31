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


  // Init tweak pane
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

    // Create canvas folder
    const canvasFolder = pane.addFolder({ title: "Canvas" });

    // Bind values inside canvas folder
    canvasFolder.addBinding(RATIO, "ratio", {
      options: {
        square: "square",
        portrait: "portrait",
        landscape: "landscape",
      },
    });

    canvasFolder.addBinding(SPREAD, "spread", {
      options: {
        vertical: "vertical",
        horizontal: "horizontal",
        noise: "noise",
      },
    });

    canvasFolder.addBinding(GRID, "division", { min: 10, max: 100, step: 20 });
    canvasFolder.addBinding(SEED, "seed", { min: 0, max: 1 });

    pane.addButton({ title: "Shuffle" }).on("click", applySettings); // Shuffle button
    pane.addButton({ title: "Download" }).on("click", saveCurrentCanvas); // Download button

    pane.on("change", applySettings);
  }

  // Define size on the canvas depending given orientation
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

  // Resize canvas depending on given
  function applySettings() {
    setRatio();
    p.resizeCanvas(canvasSizeW, canvasSizeH);
    drawGrid(p, GRID.division);
  }

  // Returns a random color
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

  // Save canvas
  function saveCurrentCanvas() {
    p.saveCanvas("kawano-artwork", "png");
  }

  // Setup canvas
  p.setup = () => {
    p.pixelDensity(5);

    // Set canvas initial size and permanent ID.
    setRatio();
    const cnv = p.createCanvas(canvasSizeW, canvasSizeH);
    cnv.parent(document.body);
    cnv.id("p5-cnv");

    // Draw background and grid
    // p.background(...defaultConfig.bgColor);
    drawGrid(p, GRID.division);

    // Init tweakpane
    initTweek();
  };
}

new p5(sketch);
