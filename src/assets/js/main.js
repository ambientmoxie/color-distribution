import "../scss/style.scss";
import p5 from "p5";
import { Pane } from "tweakpane";
let shuffleButton;

// Default configuration
export const defaultConfig = {
  colors: {
    color0: "#fff",
    color1: "#24262e",
    color2: "#ff4514",
    color3: "#195dff",
  },
  // ratio: "square",
  spread: "horizontal",
  seed: 0.3,
  division: 40,
};

function sketch(p) {
  let currentColor;
  const canvasSizeW = 500;
  const canvasSizeH = 500;

  /*
   * ---------------------------------------
   * Init TweakPane
   * ---------------------------------------
   */

  function initTweek() {
    const pane = new Pane();

    // Add folders
    const colorsFolder = pane.addFolder({ title: "Colors" });
    const canvasFolder = pane.addFolder({ title: "Canvas" });

    // Add colors
    Object.keys(defaultConfig.colors).forEach((key, index) => {
      colorsFolder.addBinding(defaultConfig.colors, key, {
        label: `color ${index + 1}`,
      });
    });

    // Add spread type
    canvasFolder.addBinding(defaultConfig, "spread", {
      options: {
        vertical: "vertical",
        horizontal: "horizontal",
        noise: "noise",
      },
    });

    // Add division value
    canvasFolder.addBinding(defaultConfig, "division", {
      min: 10,
      max: 200,
      step: 10,
    });

    // Add seed
    canvasFolder.addBinding(defaultConfig, "seed", { min: 0, max: 1 });

    
    // Add button 
    shuffleButton = pane .addButton({ title: "Shuffle" }).on("click", applySettings); // Shuffle is stored inside a value to be disabled in case of noise spread scenario
    pane.addButton({ title: "Download" }).on("click", saveCurrentCanvas);

    // update canvas every time a value is updated
    pane.on("change", applySettings);
  }

  // Resize canvas depending on given
  function applySettings() {
    if (defaultConfig.spread === "noise") {
      shuffleButton.disabled = true;
    } else {
      shuffleButton.disabled = false;
    }
    drawGrid(p, defaultConfig.division);
  }

  /*
   * ---------------------------------------
   * Mapping colors depending on spread type
   * ---------------------------------------
   */

  // Using noise
  function mapNoiseToColor(noiseVal, colors) {
    const colorKeys = Object.keys(colors);
    const scaledIndex = Math.floor(noiseVal * colorKeys.length);
    return colors[colorKeys[scaledIndex]];
  }

  // Using random
  function getRandomColor() {
    const keys = Object.keys(defaultConfig.colors);
    const randomKey = keys[p.floor(p.random(keys.length))];
    return defaultConfig.colors[randomKey];
  }

  // Draw the grid, based on vertical/horizontal or noise distribution
  function drawGrid(p, amount) {
    const w = p.width / amount;
    const h = w;
    let x, y;

    // Random distrubution scenario
    if (
      defaultConfig.spread == "horizontal" ||
      defaultConfig.spread == "vertical"
    ) {
      for (let i = 0; i < amount; i++) {
        for (let j = 0; j < amount; j++) {
          if (p.random(1) < defaultConfig.seed) {
            currentColor = getRandomColor();
          } else {
            currentColor = currentColor;
          }

          // Determine x and y positions based on spread
          x = defaultConfig.spread == "horizontal" ? j : i;
          y = defaultConfig.spread == "horizontal" ? i : j;

          // Draw the rectangle
          p.stroke(currentColor);
          p.fill(currentColor);
          p.rect(w * x, h * y, w, h);
        }
      }
    } else {

      // Noise distribution scenario
      for (let x = 0; x < amount; x++) {
        for (let y = 0; y < amount; y++) {
          
          // Calculate a noise value for current cell
          let noiseVal = p.noise(
            (x * defaultConfig.seed) / 5,
            (y * defaultConfig.seed) / 5
          );

          // Map noise value to one of the predefined colors
          currentColor = mapNoiseToColor(noiseVal, defaultConfig.colors);

          // Draw the rectangle with the color determined by noise
          p.fill(currentColor);
          p.stroke(currentColor);
          p.rect(x * w, y * h, w, h);
        }
      }
    }
  }

  // Setup canvas
  p.setup = () => {
    const cnv = p.createCanvas(canvasSizeW, canvasSizeH);
    cnv.parent(document.body);
    cnv.id("p5-cnv");

    // Draw background and grid
    currentColor = getRandomColor(); // Set initial color
    drawGrid(p, defaultConfig.division);

    // Init tweakpane
    initTweek();
  };
}

// Save canvas
function saveCurrentCanvas() {
  p.saveCanvas("kawano-artwork", "png");
}

new p5(sketch);
