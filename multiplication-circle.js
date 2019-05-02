/* canvas coords note:
 * -,- | +,-
 * -----------
 * -,+ | +,+
 */

const TAU = Math.PI * 2;

let drawCanvasID,
  canvas,
  cheight2,
  radius;

function incAndDraw(elementId, incVal) {
  let val = Math.round(Number(document.getElementById(elementId).value) * 1000);
  incVal = Math.round(incVal * 1000);
  document.getElementById(elementId).value = (val + incVal) / 1000;
  drawCanvas();
}

function toggleAnimation() {
  let button = document.getElementById('startStopButton');
  if (button.innerHTML == 'Start Animation') {
    let msPerFrame = Number(1000 / document.getElementById('framesPerSec').value);
    drawCanvasID = setInterval(incMultAndDraw, msPerFrame);
    button.innerHTML = 'Stop Animation';
  } else {
    clearInterval(drawCanvasID);
    button.innerHTML = 'Start Animation';
  }
}

function incMultAndDraw(decrement) {
  let multiplierInput = document.getElementById('multiplier');
  let multiplier = Math.round(Number(multiplierInput.value) * 1000);
  let delta = Math.round(Number(document.getElementById('delta').value) * 1000);
  if (decrement === 'decrement') {
    multiplierInput.value = (multiplier - delta) / 1000;
  } else {
    multiplierInput.value = (multiplier + delta) / 1000;
  }
  drawCanvas();
}

function incModAndDraw(decrement) {
  let modulusInput = document.getElementById('modulus');
  let modulus = Number(modulusInput.value);
  let delta = 1;
  if (decrement === 'decrement') {
    modulusInput.value = modulus - delta;
  } else {
    modulusInput.value = modulus + delta;
  }
  drawCanvas();
}

function slideUpdateField(fieldValId, sliderValId) {
  document.getElementById(fieldValId).value = document.getElementById(sliderValId).value;
  drawCanvas();
}

window.onload = function initCanvas() {
  // Making variables global for repeated access in drawCanvas()
  canvas = document.querySelector('.multCircle__canvas');
  ctx = canvas.getContext('2d');
  cheight2 = canvas.height / 2;
  radius = cheight2 * 0.9;

  // Canvas settings
  ctx.translate(cheight2, cheight2);
  ctx.font = '1rem monospace';

  /* Setup event handlers */
  let decrement = 'decrement';
  document.getElementById('dotRadius').addEventListener('keyup', drawCanvas);
  document.getElementById('multiplier').addEventListener('keyup', drawCanvas);
  document.getElementById('modulus').addEventListener('keyup', drawCanvas);
  document.getElementById('startStopButton').addEventListener('click', toggleAnimation);
  document.getElementById('incMultAndDraw').addEventListener('click', incMultAndDraw);
  document.getElementById('decMultAndDraw')
    .addEventListener('click', function () {incMultAndDraw(decrement);});
  document.getElementById('incModAndDraw').addEventListener('click', incModAndDraw);
  document.getElementById('decModAndDraw')
    .addEventListener('click', function () {incModAndDraw(decrement);});
  document.getElementById('modrange')
    .addEventListener('input', function () {slideUpdateField('modulus', 'modrange');});
  document.getElementById('multrange')
    .addEventListener('input', function () {slideUpdateField('multiplier', 'multrange');});
  document.getElementById('incDotDraw')
    .addEventListener('click', function () {incAndDraw('dotRadius', 1);});
  document.getElementById('decDotDraw')
    .addEventListener('click', function () {incAndDraw('dotRadius', -1);});

  /* Draw canvas */
  drawCanvas();
};

function drawCanvas () {
  let dotRadius = document.getElementById('dotRadius').value;
  let modulus = document.getElementById('modulus').value;
  let multiplier = document.getElementById('multiplier').value;
  let products = getProducts(modulus, radius, multiplier);

  // reset canvas and write modulus and multiplier values
  ctx.clearRect(-(cheight2), -(cheight2), canvas.height*2, canvas.height*2);
  ctx.fillText('Mod:  ' + modulus, -(cheight2) + 15, -(cheight2) + 20);
  ctx.fillText('Mult: ' + multiplier, -(cheight2) + 15, -(cheight2) + 40);

  products.map((product) => {
    // draw dot of origin
    ctx.beginPath();
    ctx.arc(product.origin.x, product.origin.y, dotRadius, 0, TAU);
    ctx.fill();
    // line to destination
    ctx.beginPath();
    ctx.moveTo(product.origin.x, product.origin.y);
    ctx.lineTo(product.dest.x, product.dest.y);
    ctx.stroke();
  });
}

function getProducts(modulus, radius, multiplier) {
  let products = [];
  for (let i = 0; i < modulus; i++) {
    let originAngle = angleFromNumber(i, modulus);
    let destAngle = angleFromNumber(i * multiplier, modulus);
    products[i] = {
      origin: {
        x: radius * Math.cos(originAngle),
        y: radius * Math.sin(originAngle)
      },
      dest: {
        x: radius * Math.cos(destAngle),
        y: radius * Math.sin(destAngle)
      }
    };
  }
  return products;
}

function angleFromNumber(num, modulus) {
  return (num / modulus) * TAU;
}
