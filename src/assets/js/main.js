import "../scss/style.scss";
import p5 from "p5";
import { Pane } from "tweakpane";

// Default configuration

export const defaultConfig = {
  colors: {
    color0: "#fff",
    color1: "#24262e",
    color2: "#ff4514",
    color3: "#195dff",
  },
  ratio: "square",
  spread: "horizontal",
  seed: 0.3,
  division: 40,
};

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
    Object.keys(defaultConfig.colors).forEach((key, index) => {
      colorsFolder.addBinding(defaultConfig.colors, key, {
        label: `color ${index + 1}`,
      });
    });

    // Create canvas folder
    const canvasFolder = pane.addFolder({ title: "Canvas" });

    // Bind values inside canvas folder
    canvasFolder.addBinding(defaultConfig, "ratio", {
      options: {
        square: "square",
        portrait: "portrait",
        landscape: "landscape",
      },
    });

    canvasFolder.addBinding(defaultConfig, "spread", {
      options: {
        vertical: "vertical",
        horizontal: "horizontal",
        noise: "noise",
      },
    });

    canvasFolder.addBinding(defaultConfig, "division", {
      min: 10,
      max: 100,
      step: 20,
    });
    canvasFolder.addBinding(defaultConfig, "seed", { min: 0, max: 1 });

    pane.addButton({ title: "Shuffle" }).on("click", applySettings); // Shuffle button
    pane.addButton({ title: "Download" }).on("click", saveCurrentCanvas); // Download button

    pane.on("change", applySettings);
  }

  // Define size on the canvas depending given orientation
  function setRatio() {
    if (defaultConfig.ratio == "landscape") {
      canvasSizeW = 600;
      canvasSizeH = 400;
    } else if (defaultConfig.ratio == "portrait") {
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
    drawGrid(p, defaultConfig.division);
  }

  // Returns a random color
  function getRandomColor() {
    const keys = Object.keys(defaultConfig.colors);
    const randomKey = keys[p.floor(p.random(keys.length))];
    return defaultConfig.colors[randomKey];
  }

  function drawGrid(p, amount) {
    const w = p.width / amount;
    const h = w;

    let x, y;

    // Random distrubution

    const largerRange =
      defaultConfig.spread == "horizontal" ? amount * 2 : amount;
    const smallerRange =
      defaultConfig.spread == "horizontal" ? amount : amount * 2;

    for (let i = 0; i < largerRange; i++) {
      for (let j = 0; j < smallerRange; j++) {
        // Determine color based on spread type
        if (
          defaultConfig.spread === "horizontal" ||
          defaultConfig.spread === "vertical"
        ) {
          if (p.random(1) < defaultConfig.seed) {
            currentColor = getRandomColor();
          } else {
            currentColor = currentColor;
          }
        } else if (defaultConfig.spread === "noise") {
          let noiseFactor = p.noise(j * 0.1, i * 0.1);
          if (noiseFactor < defaultConfig.seed) {
            currentColor = getRandomColor();
          }
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

    // Noise distribution
  }

  // Save canvas
  function saveCurrentCanvas() {
    p.saveCanvas("kawano-artwork", "png");
  }

  // Setup canvas
  p.setup = () => {
    // Set canvas initial size and permanent ID.
    setRatio();
    const cnv = p.createCanvas(canvasSizeW, canvasSizeH);
    cnv.parent(document.body);
    cnv.id("p5-cnv");

    // Draw background and grid
    // p.background(...defaultConfig.bgColor);
    currentColor = getRandomColor();
    drawGrid(p, defaultConfig.division);

    // Init tweakpane
    initTweek();
  };
}

new p5(sketch);
