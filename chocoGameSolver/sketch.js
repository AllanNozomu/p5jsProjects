let piecesColors;

const TILE_WIDTH = 20;
const piecesPositions = [
  [new Position(0,0),new Position(1,0),new Position(2,0),new Position(1,-1),new Position(1,1)],
  [new Position(0,0),new Position(0,1),new Position(1,1),new Position(1,2),new Position(2,2)],
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(0,3),new Position(0,4)],
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(0,3),new Position(1,3)],
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(1,2),new Position(2,2)],
  [new Position(0,2),new Position(1,0),new Position(1,1),new Position(1,2),new Position(2,0)],
  [new Position(0,2),new Position(1,0),new Position(1,1),new Position(1,2),new Position(0,0)],
  [new Position(0,2),new Position(1,0),new Position(1,1),new Position(1,2),new Position(2,1)],
  [new Position(0,2),new Position(1,0),new Position(1,1),new Position(1,2),new Position(2,2)],
  [new Position(0,2),new Position(1,0),new Position(1,1),new Position(1,2),new Position(1,3)],
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(1,0),new Position(1,1)],
  [new Position(0,2),new Position(1,0),new Position(1,1),new Position(1,2),new Position(0,3)]
];
let board;
let pieces = [];
let nextPosition;
let resolutions = [];
let slider1;
let slider2;

function setup() {
  createCanvas(500, 300);
  frameRate(30);

  // Need to put here to make color work
  piecesColors = [
    color('magenta'),
    color('blue'),
    color('gold'),
    color('red'),
    color('purple'),
    color('black'),
    color('darkblue'),
    color('green'),
    color('cyan'),
    color('gray'),
    color('pink'),
    color('brown')
  ]
  
  tiles = [];
  for (let i = 0 ; i < 10; ++i){
    for (let j = 0 ; j < 6; ++j){
      tiles.push(new Position(i,j));
    }
  }
  board = new Board(tiles);
  
  for (let i = 0 ; i < piecesPositions.length; ++i) {
    pieces.push(new Piece(i + 1, piecesPositions[i], piecesColors[i]));
  }

  for (let i = 0 ; i < piecesPositions.length; ++i) {
    for (let j = 0 ; j < pieces[i].possiblePositions.length; ++j) {
      // board.solve(0, 0, i, j);
    }
  }

  resolutions = JSON.parse(all_resolutions);

  slider1 = createSlider(0, 93, 0, 1);
  slider1.position(50, 200);
  slider1.style('width', '400px');

  slider2 = createSlider(0, 100, 0, 1);
  slider2.position(50, 250);
  slider2.style('width', '400px');
}

function draw() {
  background(220);

  let resVal = slider1.value() * 100 + slider2.value();
  resVal = Math.min(resVal, resolutions.length - 1);

  textSize(16);
  fill(0);
  text(`${resVal}`,  50 / 2, 180);

  
  for (let i = 0;  i < resolutions[resVal].length; ++i) {
    let info = resolutions[resVal][i];
    board.insert(info[0], info[1], pieces[i].possiblePositions[info[2]], i + 1);
  }
  board.draw(7, 1);
}

function Position(x = 0, y = 0){
  this.x = x;
  this.y = y;
}