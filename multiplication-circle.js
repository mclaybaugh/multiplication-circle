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

function getSubNumber (multiplier) {
  if (multiplier - Math.floor(multiplier) == 0) {
    return 1;
  }
  else if (multiplier * 10 - Math.floor(multiplier * 10) == 0) {
    return 10;
  }
  else if (multiplier * 100 - Math.floor(multiplier * 100) == 0) {
    return 100;
  }
  else if (multiplier * 1000 - Math.floor(multiplier * 1000) == 0) {
    return 1000;
  }
  else if (multiplier * 10000 - Math.floor(multiplier * 10000) == 0) {
    return 10000;
  }
  else { return null; }
}

function getPoints(modulus, radius, subNumber = 1) {
  let points = [];
  let i = 0;
  for (let angle = 0; angle < TAU; angle += (TAU / (modulus * subNumber))) {
    points[i] = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
    i++;
  }
  return points;
}

function drawCanvas () {
  /****************************************************************
   * Step 1: get values from input fields and calculate coords
   * **************************************************************/
  let dotRadius = document.getElementById('dotRadius').value;
  let modulus = document.getElementById('modulus').value;
  let multiplier = document.getElementById('multiplier').value;
  let originPoints = getPointsArray(modulus, radius);
  let subNumber = getSubNumber(multiplier);
  if (subNumber === null) {
    let errorMessage = 'Multiplier of \'' + multiplier + '\' is not supported.';
    ctx.clearRect(-(cheight2), -(cheight2), canvas.height*2, canvas.height*2);
    ctx.fillText(errorMessage, -(cheight2) + 15, -(cheight2) + 15);
    return;
  }
  let destPoints = getPointsArray(modulus, radius, subNumber);

  /****************************************************************
   * Step 2: Draw the dots and lines on the canvas
   * **************************************************************/
  // clear canvas and previous paths
  ctx.clearRect(-(cheight2), -(cheight2), canvas.height*2, canvas.height*2);

  // write the values
  let modString = 'Mod:  ' + modulus.toString();
  let multString = 'Mult: ' + multiplier.toString();
  ctx.fillText(modString, -(cheight2) + 15, -(cheight2) + 20);
  ctx.fillText(multString, -(cheight2) + 15, -(cheight2) + 40);

  // draw dots
  originPoints.map((coord) => {
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, dotRadius, 0, TAU);
    ctx.fill();
  });

  // draw lines
  let smallIndex = 0;
  for (let index = 0; index < destPoints.length; index += subNumber) {
    let endpoint = Math.round((index * multiplier) % (modulus * subNumber));
    ctx.beginPath();
    ctx.moveTo(originPoints[smallIndex].x, originPoints[smallIndex].y);
    ctx.lineTo(destPoints[endpoint].x, destPoints[endpoint].y);
    ctx.stroke();
    smallIndex++;
  }
}
