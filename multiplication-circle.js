/* Author: Michael Claybaugh
 * Purpose: Draw multiplication circle to Canvas (HTML5)
 *
 * canvas coords note:
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
  var button = document.getElementById('startStopButton');
  if (button.innerHTML == 'Start Animation') {
    var msPerFrame = Number(1000 / document.getElementById('framesPerSec').value);
    drawCanvasID = setInterval(incMultAndDraw, msPerFrame);
    button.innerHTML = 'Stop Animation';
  } else {
    clearInterval(drawCanvasID);
    button.innerHTML = 'Start Animation';
  }
}

function incMultAndDraw(decrement) {
  var multiplierInput = document.getElementById('multiplier');
  var multiplier = Math.round(Number(multiplierInput.value) * 1000);
  var delta = Math.round(Number(document.getElementById('delta').value) * 1000);
  if (decrement === 'decrement') {
    multiplierInput.value = (multiplier - delta) / 1000;
  } else {
    multiplierInput.value = (multiplier + delta) / 1000;
  }
  drawCanvas();
}

function incModAndDraw(decrement) {
  var modulusInput = document.getElementById('modulus');
  var modulus = Number(modulusInput.value);
  var delta = 1;
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

function Coord (x, y) {
  this.x = x;
  this.y = y;
}

function getSubNumber (multiplier) {
  var subNumber;
  if (multiplier - Math.floor(multiplier) == 0) {
    subNumber = 1;
  }
  else if (multiplier * 10 - Math.floor(multiplier * 10) == 0) {
    subNumber = 10;
  }
  else if (multiplier * 100 - Math.floor(multiplier * 100) == 0) {
    subNumber = 100;
  }
  else { subNumber = null; }
  return subNumber;
}

function getPointsArray (modulus, radius, subNumber) {
  if (typeof subNumber === 'undefined') {
    subNumber = 1;
  }
  var subPointsArray = [];
  var kindex = 0;
  for (var angle = 0; angle < TAU; angle = angle + (TAU / (modulus * subNumber))) {
    subPointsArray[kindex] = new Coord(radius * Math.cos(angle),
      radius * Math.sin(angle));
    kindex++;
  }
  return subPointsArray;
}

function drawCanvas () {
  /****************************************************************
   * Step 1: get values from input fields and calculate coords
   * **************************************************************/
  var dotRadius = document.getElementById('dotRadius').value;
  var modulus = document.getElementById('modulus').value;
  var multiplier = document.getElementById('multiplier').value;
  var pointsArray = getPointsArray(modulus, radius);
  var subNumber = getSubNumber(multiplier);
  if (subNumber === null) {
    var errorMessage = 'Multiplier of \'' + multiplier.toString() + '\' is not supported.';
    ctx.clearRect(-(cheight2), -(cheight2), canvas.height*2, canvas.height*2);
    ctx.fillText(errorMessage, -(cheight2) + 15, -(cheight2) + 15);
    return;
  }
  var subPointsArray = getPointsArray(modulus, radius, subNumber);

  /****************************************************************
   * Step 2: Draw the dots and lines on the canvas
   * **************************************************************/
  // clear canvas and previous paths
  ctx.clearRect(-(cheight2), -(cheight2), canvas.height*2, canvas.height*2);

  // write the values
  var modString = 'Mod:  ' + modulus.toString();
  var multString = 'Mult: ' + multiplier.toString();
  ctx.fillText(modString, -(cheight2) + 15, -(cheight2) + 20);
  ctx.fillText(multString, -(cheight2) + 15, -(cheight2) + 40);

  // draw dots
  for (var coord in pointsArray) {
    ctx.beginPath();
    ctx.arc(pointsArray[coord].x, pointsArray[coord].y, dotRadius, 0, TAU);
    ctx.fill();
  }

  // draw lines
  var smallIndex = 0;
  for (var index = 0; index < subPointsArray.length; index = index + subNumber) {
    // round endpoint equation to avoid errors with numbers like 10.00001
    var endpoint = Math.round((index * multiplier) % (modulus * subNumber));
    ctx.beginPath();
    ctx.moveTo(pointsArray[smallIndex].x, pointsArray[smallIndex].y);
    ctx.lineTo(subPointsArray[endpoint].x, subPointsArray[endpoint].y);
    ctx.stroke();
    smallIndex++;
  }
}
