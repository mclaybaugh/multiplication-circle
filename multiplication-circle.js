/* canvas coords note:
 * -,- | +,-
 * -----------
 * -,+ | +,+
 */

const TAU = Math.PI * 2;

let drawCanvasID;

function toggleAnimation(event) {
  if (event.target.innerHTML == 'Start Animation') {
    let msPerFrame = Number(1000 / document.getElementById('framesPerSec').value);
    drawCanvasID = setInterval(incMultAndDraw, msPerFrame);
    event.target.innerHTML = 'Stop Animation';
  } else {
    clearInterval(drawCanvasID);
    event.target.innerHTML = 'Start Animation';
  }
}

function incMultAndDraw() {
  let multiplierInput = document.getElementById('multiplier');
  let multiplier = Math.round(Number(multiplierInput.value) * 1000);
  let delta = Math.round(Number(document.getElementById('delta').value) * 1000);
  multiplierInput.value = (multiplier + delta) / 1000;
  drawCanvas();
}

function slideUpdateField(draw) {
  return (event) => {
    document.getElementById(event.target.getAttribute('data-controls')).value = event.target.value;
    draw();
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Making variables global for repeated access in drawCanvas()
  let canvas = document.querySelector('.multCircle__canvas');
  let context2d = canvas.getContext('2d');
  let halfHeight = canvas.height / 2;
  let radius = halfHeight * 0.9;

  // Canvas settings
  context2d.translate(halfHeight, halfHeight);
  context2d.font = '1rem monospace';

  // Setup event handlers
  let draw = drawCanvas(canvas, context2d, radius);
  let slideHandler = slideUpdateField(draw);
  document.querySelectorAll('#modulus, #multiplier, #dotRadius').forEach((el) => {
    el.addEventListener('change', draw);
    el.addEventListener('keyup', draw);
  });
  document.querySelectorAll('#modrange, #multrange').forEach((el) => {
    el.addEventListener('input', slideHandler);
  });
  document.querySelectorAll('#startStopButton').forEach((el) => {
    el.addEventListener('click', toggleAnimation);
  });

  // Draw canvas first time
  draw();
});

function drawCanvas (canvas, context, radius) {
  return () => {
    let dotRadius = document.getElementById('dotRadius').value;
    let modulus = document.getElementById('modulus').value;
    let multiplier = document.getElementById('multiplier').value;
    let products = getProducts(modulus, radius, multiplier);

    // reset canvas and write modulus and multiplier values
    let halfHeight = canvas.height / 2;
    let twiceHeight = canvas.height * 2;
    context.clearRect(-(halfHeight), -(halfHeight), twiceHeight, twiceHeight);
    context.fillText('Mod:  ' + modulus, -(halfHeight) + 15, -(halfHeight) + 20);
    context.fillText('Mult: ' + multiplier, -(halfHeight) + 15, -(halfHeight) + 40);

    products.map((product) => {
      // draw dot of origin
      context.beginPath();
      context.arc(product.origin.x, product.origin.y, dotRadius, 0, TAU);
      context.fill();
      // line to destination
      context.beginPath();
      context.moveTo(product.origin.x, product.origin.y);
      context.lineTo(product.dest.x, product.dest.y);
      context.stroke();
    });
  };
}

function getProducts(modulus, radius, multiplier) {
  return range(modulus).map(coord_function(modulus, radius, multiplier));
}

function coord_function(modulus, radius, multiplier) {
  return (x) => {
    let originAngle = angleFromNumber(x, modulus);
    let destAngle = angleFromNumber(x * multiplier, modulus);
    return {
      origin: {
        x: radius * Math.cos(originAngle),
        y: radius * Math.sin(originAngle)
      },
      dest: {
        x: radius * Math.cos(destAngle),
        y: radius * Math.sin(destAngle)
      }
    };
  };
}


function angleFromNumber(num, modulus) {
  return (num / modulus) * TAU;
}

function range(n) {
  let xs = [];
  for (let i = 0; i < n; i++) {
    xs[i] = i;
  }
  return xs;
}