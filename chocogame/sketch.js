function Position(x = 0, y = 0){
  this.x = x;
  this.y = y;
}

const WIDTH = 500;
const HEIGHT = 500;
const TILE_WIDTH = 20;
const PIECES_MAP = [
  [new Position(0,0),new Position(1,0),new Position(2,0),new Position(1,-1),new Position(1,1)],
  [new Position(0,0),new Position(1,0),new Position(1,1),new Position(2,1),new Position(2,2)],
  [new Position(0,0),new Position(1,0),new Position(2,0),new Position(3,0),new Position(4,0)],
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(0,3),new Position(1,3)],
  
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(1,2),new Position(2,2)],
  [new Position(0,0),new Position(0,1),new Position(1,1),new Position(2,1),new Position(2,2)],
  [new Position(0,2),new Position(1,0),new Position(1,1),new Position(1,2),new Position(0,0)],
  [new Position(0,0),new Position(0,1),new Position(1,1),new Position(1,2),new Position(2,1)],
  
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(1,1),new Position(2,1)],
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(0,3),new Position(1,1)],
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(1,0),new Position(1,1)],
  [new Position(0,0),new Position(0,1),new Position(0,2),new Position(1,2),new Position(1,3)]
];

let board;
let piecesColors;
let pieces = [];
let buttonsPos = [];
let usedPieces = {};
let pressedPiece = null;


function setup() {
  createCanvas(500, 500);
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
  
  // Create each piece and set its position on the game
  for (let i = 0 ; i < PIECES_MAP.length; ++i) {
    pieces.push(new Piece(i + 1, PIECES_MAP[i], piecesColors[i]));
    let pos = new Position(6 * (i % 4) + 1, 7 + ((int)(i / 4) * 5) + 2);
    buttonsPos.push(pos);
  }
}

function draw() {
  // Hide cursor when holding a piece
  if (pressedPiece == null) cursor();
  else noCursor();

  background(220);
  board.draw(7, 1);
  
  // Draw each piece square
  for (let i = 0 ; i < PIECES_MAP.length; ++i) {
    let pos = buttonsPos[i];

    fill(110);
    rect(pos.x * TILE_WIDTH, pos.y * TILE_WIDTH, 100, 80);
  }

  let placed = 0;
  for (let i = 0 ; i < PIECES_MAP.length; ++i) {
    if (usedPieces[i]) {
      placed++;
      continue;
    }
    
    if (pressedPiece != null && i === pressedPiece) {
      continue;
    }
    
    // Draw each piece (the first piece is an exception)
    let pos = buttonsPos[i];
    if (i == 0)
      pieces[i].draw(pos.x, pos.y + 1, 0)
    else 
      pieces[i].draw(pos.x, pos.y, 0);
  }

  // Make the selected piece float
  if (pressedPiece !== null) {
    let dragPos = new Position(Math.floor(mouseX / TILE_WIDTH), Math.floor(mouseY / TILE_WIDTH));
    pieces[pressedPiece].draw(dragPos.x, dragPos.y);
  }

  // Verify if all the pieces was put
  if (placed === PIECES_MAP.length) {
    textSize(32);
    fill(0);
    text('You did it', WIDTH / 2 - textWidth('You dit it') / 2, HEIGHT - 8);
  }
}

function mousePressed(){
  if (mouseButton !== LEFT) return;
  // Real position (based on Tile_WIDTH)
  let pos = new Position(Math.floor(mouseX / TILE_WIDTH), Math.floor(mouseY / TILE_WIDTH));
  // board fixed position
  let fixPos = new Position(pos.x - 7, pos.y - 1);

  // Current holding a piece
  if (pressedPiece != null) {
    // Check click inside board
    if (fixPos.x < 0 || fixPos. x >= 10 || fixPos.y < 0 || fixPos.y >= 6) {
      pressedPiece = null;
      return;
    }

    let piece = pieces[pressedPiece];

    if (board.canInsert(fixPos.x, fixPos.y, piece.tiles)) {
      board.insert(fixPos.x, fixPos.y, piece.tiles, piece.id);
      usedPieces[pressedPiece] = true;
      pressedPiece = null;
    }
  // Clicked on board
  } else if (fixPos.x >= 0 && fixPos. x < 10 && fixPos.y >= 0 && fixPos.y < 6) {
    // Check if clicked in a piece and removed it
    if (board.painted[fixPos.x][fixPos.y] > 0) {
      pressedPiece = board.painted[fixPos.x][fixPos.y] - 1;
      board.removeColor(pressedPiece + 1);
      usedPieces[pressedPiece] = false;
    }
  // Clicked in a piece square
  } else {
    for (let i = 0; i < buttonsPos.length; ++i) {
      let currButton = buttonsPos[i];
      if (currButton.x <= pos.x && pos.x <= currButton.x + 5) {
        if (currButton.y <= pos.y && pos.y <= currButton.y + 4 && !usedPieces[i]) {
          pressedPiece = i;
          pieces[i].resetTo0();
          break;
        }
      }
    }
  }
}

function keyPressed(){
  // Restart the game
  if (key == "Escape") {
    pressedPiece = null;
    usedPieces = {};
    for (let i = 0 ; i < PIECES_MAP.length; ++i) {
      board.removeColor(i + 1);
    }
    return;
  }

  // Rotate the piece with Q and E
  if (pressedPiece != null) {
    if (key === 'q' || key === 'Q') {
      let piece = pieces[pressedPiece];
      piece.rotateAntiClockwise();
    } else if (key === 'e' || key === 'E') {
      let piece = pieces[pressedPiece];
      piece.rotate();
    }
  }
}