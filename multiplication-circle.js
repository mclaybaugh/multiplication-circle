/* canvas coords note:
 * -,- | +,-
 * -----------
 * -,+ | +,+
 */

const TAU = Math.PI * 2;

function toggle_animation_function(draw) {
  let drawCanvasID;
  return (event) => {
    let animate = () => {
      increment_multiplier();
      draw();
    };
    if (event.target.innerText == 'Start Animation') {
      let msPerFrame = Number(1000 / document.getElementById('framesPerSec').value);
      drawCanvasID = setInterval(animate, msPerFrame);
      event.target.innerText = 'Stop Animation';
    } else {
      clearInterval(drawCanvasID);
      event.target.innerText = 'Start Animation';
    }
  };
}

function increment_multiplier() {
  let multiplierInput = document.getElementById('multiplier');
  let multiplier = Math.round(Number(multiplierInput.value) * 1000);
  let delta = Math.round(Number(document.getElementById('delta').value) * 1000);
  multiplierInput.value = (multiplier + delta) / 1000;
}

function slide_update_field(event) {
  document.getElementById(event.target.getAttribute('data-controls')).value = event.target.value;
}

document.addEventListener('DOMContentLoaded', () => {
  let canvas = document.querySelector('.multCircle__canvas');
  let context = canvas.getContext('2d');
  let halfHeight = canvas.height / 2;
  let radius = halfHeight * 0.9;
  let draw = draw_function(context, radius, canvas.height);
  let toggleAnimation = toggle_animation_function(draw);

  // Canvas settings
  context.translate(halfHeight, halfHeight);
  context.font = '1rem monospace';

  // Setup event handlers
  document.querySelectorAll('#modulus, #multiplier, #dotRadius').forEach((el) => {
    el.addEventListener('change', draw);
    el.addEventListener('keyup', draw);
  });
  document.querySelectorAll('#modrange, #multrange').forEach((el) => {
    el.addEventListener('input', slide_update_field);
    el.addEventListener('input', draw);
  });
  document.querySelectorAll('#startStopButton').forEach((el) => {
    el.addEventListener('click', toggleAnimation);
  });

  // Draw canvas first time
  draw();
});

function draw_function(context, radius, height) {
  return () => {
    let dotRadius = document.getElementById('dotRadius').value;
    let modulus = document.getElementById('modulus').value;
    let multiplier = document.getElementById('multiplier').value;
    let products = getProducts(modulus, radius, multiplier);

    // reset canvas and write modulus and multiplier values
    let halfHeight = height / 2;
    let twiceHeight = height * 2;
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