const ts = 50;
let activePiece = false;
let pieces = [];
let spaces = [];

let confetti = [];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let colors;

let checkWin = false;
let win = false;

function setup() {
  createCanvas(650, 650);
  colors = [color(35, 59, 176, 150), color(90, 10, 50, 150), color(30, 100, 60, 150), color(30, 40, 100, 150), color(100, 40, 100, 150), color(100, 100, 40, 150), color(200, 50, 50, 150), color(150, 20, 150, 150)];
  pieces = [
    {
      type: 0,
      x: width - ts,
      y: 2 * ts,
      active: false,
      rotation: 0,
      flip: false,
      color: colors[0]
    },
    {
      type: 1,
      x: ts,
      y: ts * 5,
      active: false,
      rotation: 0,
      flip: false,
      color: colors[1]
    },
    {
      type: 2,
      x: ts,
      y: ts,
      active: false,
      rotation: 0,
      flip: false,
      color: colors[2]
    },
    {
      type: 3,
      x: ts,
      y: height - (2 * ts),
      active: false,
      rotation: 0,
      flip: false,
      color: colors[3]
    },
    {
      type: 4,
      x: 5 * ts,
      y: 0,
      active: false,
      rotation: 0,
      flip: false,
      color: colors[4]
    },
    {
      type: 5,
      x: 7 * ts,
      y: height - ts,
      active: false,
      rotation: 0,
      flip: false,
      color: colors[5]
    },
    {
      type: 6,
      x: width - ts,
      y: 7 * ts,
      active: false,
      rotation: 0,
      flip: false,
      color: colors[6]
    },
    {
      type: 7,
      x: width - (3 * ts),
      y: height - ts,
      active: false,
      rotation: 0,
      flip: false,
      color: colors[7]
    }
  ];
  initGrid();
}

function draw() {
  background(220);
  drawGrid();
  pieces.forEach(piece => drawPiece(piece));
  if (checkWin) {
    win = checkWinCondition();
    checkWin = false;
  }
  if (win) {
    if (random() < 0.7) {
      confetti.push(new Confetti());
    }
    confetti = confetti.filter(c => {
      c.draw();
      return c.y < height;
    });
  }
}

function checkWinCondition() {
  loadPixels();
  let check = true;
  let numUncovered = 0;
  spaces.forEach(space => {
    let uncovered = compareColor(space.x + 6, space.y + 6, color("tan"));
    if (space.label === day() || space.label === months[month() - 1]) {
      if (! uncovered) {
        check = false;
      }
    } else {
      if (uncovered) {
        check = false;
      }
    }
  });
  return check;
}

const emptySpaces = [[6, 0], [6, 1], [3, 6], [4, 6], [5, 6], [6, 6]];

function initGrid() {
    let day = 1;
    let monthIndex = 0;
    for (let j = 0; j < 7; j += 1) {
      for (let i = 0; i < 7; i += 1) {
        if (! emptySpaces.some((ii) => {
          return ii[0] === i && ii[1] === j;
        })) {
          let x = i * ts + (ts * 3);
          let y = j * ts + (ts * 3);
          let space = { x: x, y: y };
          let label;
          if (j < 2) {
            space.month = true;
            label = months[monthIndex]
            monthIndex += 1;
          } else {
            space.month = false;
            label = day;
            day += 1;
          }
          space.label = label;
          spaces.push(space);
        }
      }
  }
}

function drawGrid() {
  spaces.forEach(space => {
    fill("tan");
    stroke("rgb(153,94,94)");
    strokeWeight(5);
    rect(space.x, space.y, ts, ts);
    noStroke();
    fill("rgb(153,94,94)");
    textSize(16);
    if (space.month) {
      text(space.label, space.x + 10, space.y + 30);
    } else {
      text("" + space.label, space.x + 15, space.y + 30);
    }
  });
}


function mouseClicked() {
  if (win) {
    return;
  }
  if (activePiece) {
    let space = closestSpace();
    activePiece.x = space.x;
    activePiece.y = space.y;
    activePiece.active = false;
    activePiece = false;
    checkWin = true;
  } else {
    let closestPiece = closestThing(pieces);
    closestPiece.active = true;
    activePiece = closestPiece;
  }
}

function keyPressed() {
  if (activePiece) {
    if (keyCode === 87) {  // W
      activePiece.rotation = (activePiece.rotation + 1) % 4;
    } else if (keyCode === 83) {  // S
      activePiece.rotation = (activePiece.rotation - 1) % 4;
    } else if (keyCode === 69) { // E
      activePiece.flip = ! activePiece.flip;
    }
  }
}

function drawPiece(piece) {
  fill(piece.color);
  noStroke();
  push();
  
  if (piece.active) {
    translate(mouseX, mouseY);
  } else {
    translate(piece.x, piece.y);
  }
  rotate(PI * piece.rotation / 2);
  if (piece.flip) {
     scale(-1, 1); 
  }
  beginShape();
  vertex(0, 0);
  if (piece.type === 0) {
    vertex(0, 2 * ts);
    vertex(-ts, 2 * ts);
    vertex(-ts, -2 * ts);
    vertex(0, -2 * ts);
    vertex(0, -ts);
    vertex(ts, -ts);
    vertex(ts, 0);
  } else if (piece.type === 1) {
    vertex(0, 2 * ts);
    vertex(-ts, 2 * ts);
    vertex(-ts, -2 * ts);
    vertex(ts, -2 * ts);
    vertex(ts, -ts);
    vertex(0, -ts);
  } else if (piece.type === 2) {
    vertex(ts, 0);
    vertex(ts, -ts);
    vertex(2 * ts, -ts);
    vertex(2 * ts, ts);
    vertex(-ts, ts);
    vertex(-ts, -ts);
    vertex(0, -ts);
  } else if (piece.type === 3) {
    vertex(2 * ts, 0);
    vertex(2 * ts, 2 * ts);
    vertex(ts, 2 * ts);
    vertex(ts, ts);
    vertex(-ts, ts);
    vertex(-ts, -ts);
    vertex(0, -ts);
  } else if (piece.type === 4) {
    vertex(2 * ts, 0);
    vertex(2 * ts, 2 * ts);
    vertex(-ts, 2 * ts);
    vertex(-ts, 0);
  } else if (piece.type === 5) {
    vertex(0, -2 * ts);
    vertex(ts, -2 * ts);
    vertex(ts, ts);
    vertex(-2 * ts, ts);
    vertex(-2 * ts, 0);
  } else if (piece.type === 6) {
    vertex(0, 2 * ts);
    vertex(ts, 2 * ts);
    vertex(ts, -ts);
    vertex(0, -ts);
    vertex(0, -2 * ts);
    vertex(-ts, -2 * ts);
    vertex(-ts, 0);
  } else if (piece.type === 7) {
    vertex(0, -ts);
    vertex(2 * ts, -ts);
    vertex(2 * ts, ts);
    vertex(-ts, ts);
    vertex(-ts, 0);
  }
  vertex(0, 0);
  endShape();
  pop();
}
  
function closestThing(things) {
  let minDistance = -1;
  let minThing;
  
  let distance;
  things.forEach((thing) => {
    distance = pow(thing.x - mouseX, 2) + pow(thing.y - mouseY, 2);
    if (minDistance === -1 || distance < minDistance) {
      minDistance = distance;
      minThing = thing;
    }
  });
  return minThing;
}

function closestSpace(piece) {
  let retX, retY;
  if (mouseX > width) {
    retX = width;
  }
  if (mouseY > height) {
    retY = height;
  }
  const minX = mouseX - (mouseX % ts);
  const maxX = (mouseX + ts) - (mouseX % ts);
  const minY = mouseY - (mouseY % ts);
  const maxY = (mouseY + ts) - (mouseY % ts);
  const corners = [
    { x: minX, y: minY }, 
    { x: minX, y: maxY }, 
    { x: maxX, y: minY }, 
    { x: maxX, y: maxY }
  ];
  const closestCorner = closestThing(corners);
  if (mouseX > width) {
    closestCorner.x = width;
  }
  if (mouseY > height) {
    closestCorner.y = height;
  }
  return closestCorner;
}

function compareColor(x, y, clr) {
  const d = pixelDensity();
  let off = 4 * ((y * d) * width * d + (x * d));
  return pixels[off] === red(clr) &&
    pixels[off + 1] === green(clr) &&
    pixels[off + 2] === blue(clr);
}

class Confetti {
  constructor() {
    this.y = 0;
    this.x = width * random();
    this.color = random(colors.map(color => { 
      color.setAlpha(255);
      return color;
    }));
    this.time = 0;
    this.shape = random([0, 1]);
    this.size = random() * 20 + 10;
    this.speed = random() * 50 + 20;
    this.amp = random() * 10;
    this.direction = random([-1, 1]);
  }
    
  draw() {
    push();
    translate(this.x, this.y);
    translate(cos(this.time * this.speed / 50) * this.amp, sin(this.time) * 2);
    rotate(this.direction * this.time);
    scale(cos(this.time / 7), sin(this.time / 4));
    fill(this.color);
    noStroke();
    if (this.shape === 0) {
      circle(0, 0, this.size);
    } else {
      square(0, 0, this.size);
    }
    
    this.y = this.time * this.speed;
    this.time += 0.1;
    pop();
  }
}