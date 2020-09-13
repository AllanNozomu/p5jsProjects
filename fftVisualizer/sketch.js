let slider;

function setup() {
  createCanvas(1024, 512);

  slider = createSlider(1, 101, 1, 2);
  slider.position(10, 10);
  slider.style('width', '500px');
}

const RADIUS = 64;
const MINI_RADIUS = 8;

let time = 0;
let points = [];

function draw() {
  background(0);
  translate(256, 256);

  let angle = (2 * PI)/360 * time;

  stroke(255);
  noFill();

  let prev = new ComplexPoint();
  let prevPos = {x : 0, y : 0}
  let numberCircles = slider.value();

  textSize(16);
  fill(255);
  text(`${numberCircles}`,  0, 0);

  noFill();

  for (let i = 1; i <= numberCircles; i+= 2){
    prev.modulus = (4 * 100/(i *PI));
    prev.draw(prevPos.x, prevPos.y, angle * i);
    
    let newPos = prev.getPosition(angle * i);
    newPos.x += prevPos.x;
    newPos.y += prevPos.y;
    prevPos = newPos;
  }


  points.unshift(prevPos.y);
  line(prevPos.x, prevPos.y, 384, prevPos.y)

  beginShape();
  points.forEach((y,x) => {
    vertex(x + 384, y);
  });
  endShape();

  time++;
  if (points.length > 512) points.pop();
}

function ComplexPoint(real = 0, imaginary = 0) {
  this.real = real.toPrecision(6);
  this.imaginary = imaginary.toPrecision(6);

  this.modulus = Math.sqrt(real * real + imaginary * imaginary);
  this.angle = -Math.atan2(imaginary, real);

  this.getPosition = (angle = 0) => {
    let x = this.modulus * cos((this.angle + angle));
    let y = this.modulus * sin((this.angle + angle));
    return {
      x,
      y
    };
  }

  this.draw = (x = 0, y = 0, angle = 0) => {
    ellipse(x, y, 2 * this.modulus);
  
    let pos = this.getPosition(angle);
    ellipse(x + pos.x, y + pos.y, MINI_RADIUS);
  }
}