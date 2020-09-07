let piecesColors;

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
let pieces = [];
let buttonsPos = [];
let piecesRotations = {};
let usedPieces = {};
let nextPosition;
let pressedPiece;

function setup() {
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
  createCanvas(500, 500);
  frameRate(30);

  tiles = [];
  for (let i = 0 ; i < 10; ++i){
    for (let j = 0 ; j < 6; ++j){
      tiles.push(new Position(i,j));
    }
  }
  board = new Board(tiles);
  
  for (let i = 0 ; i < PIECES_MAP.length; ++i) {
    pieces.push(new Piece(i + 1, PIECES_MAP[i], piecesColors[i]));
    let pos = new Position(6 * (i % 4) + 1, 7 + ((int)(i / 4) * 5) + 2);
    buttonsPos.push(pos);
    piecesRotations[i] = 0;
  }
}

function draw() {
  if (pressedPiece == null) cursor();
  else noCursor();

  background(220);
  
  board.draw(7, 1);
  let placed = 0;
  for (let i = 0 ; i < PIECES_MAP.length; ++i) {
    let pos = buttonsPos[i];

    fill(110);
    rect(pos.x * TILE_WIDTH, pos.y * TILE_WIDTH, 100, 80);

    if (usedPieces[i]) {
      placed++;
      continue;
    }

    if (pressedPiece != null && i === pressedPiece) {
      let dragPos = new Position(Math.floor(mouseX / TILE_WIDTH), Math.floor(mouseY / TILE_WIDTH));
      pieces[i].draw(dragPos.x, dragPos.y, piecesRotations[i]);
      continue;
    }

    if (i == 0)
      pieces[i].draw(pos.x, pos.y + 1, 0)
    else 
      pieces[i].draw(pos.x, pos.y, 0);
  }

  if (placed === PIECES_MAP.length) {
    textSize(32);
    fill(0);
    text('You did it', WIDTH / 2 - textWidth('You dit it') / 2, HEIGHT - 8);
  }
}

function Board(tiles = [], rows = 0, columns = 0){
  this.tiles = tiles.sort();
  this.painted = {};
  this.usedPieces = tiles.map(() => false);
  this.usedPiecesCount = 0;

  tiles.forEach(tile => {
    if (!this.painted[tile.x]){
      this.painted[tile.x] = {};
    }
    this.painted[tile.x][tile.y] = 0;
  });
  
  this.canInsert = (x, y, tiles) => {
    for (let i = 0;  i < tiles.length; ++i) {
        if (this.painted[tiles[i].x + x] === undefined ||  this.painted[tiles[i].x + x][tiles[i].y + y]  === undefined || this.painted[tiles[i].x + x][tiles[i].y + y] !== 0) {
          return false;
        }
      }
    return true;
  }
  
  this.insert = (x, y, tiles, id) => {
    tiles.forEach(position => {
      this.painted[position.x + x][position.y + y] = id;
    });
  }
  
  this.remove = (x, y, tiles) => {
    tiles.forEach(position => {
      this.painted[position.x + x][position.y + y] = 0;
    });
  }

  this.removeColor = color => {
    this.tiles.forEach(position => {
      if (this.painted[position.x][position.y] === color)
        this.painted[position.x][position.y] = 0;
    });
  };
  
  this.nextUnused = () => {
    for (let i = 0; i < tiles.length; ++i) {
      let pos = tiles[i];
      if (this.painted[pos.x][pos.y] === 0) {
        return pos;
      }
    }
    return undefined;
  }
  
  
  this.draw = (x = 0, y = 0, painted = this.painted) => {
    this.tiles.forEach(tile => {
      let cc = painted[tile.x][tile.y];
      if (cc == 0){
        fill(color("white"));
      }else
        fill(piecesColors[cc-1]);

      rect((x + tile.x)*TILE_WIDTH, (y + tile.y)*TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
    })
  }
}

function Position(x = 0, y = 0){
  this.x = x;
  this.y = y;
}

function mousePressed(){
  if (mouseButton !== LEFT) return;

  let pos = new Position(Math.floor(mouseX / TILE_WIDTH), Math.floor(mouseY / TILE_WIDTH));
  let fixPos = new Position(pos.x - 7, pos.y - 1);

  if (pressedPiece != null) {
    let piece = pieces[pressedPiece];

    if (fixPos.x < 0 || fixPos. x >= 10 || fixPos.y < 0 || fixPos.y >= 6) {
      pressedPiece = null;
      return;
    }

    let pieceRotation = piecesRotations[pressedPiece];
    if (board.canInsert(fixPos.x, fixPos.y, piece.possiblePositions[pieceRotation])) {
      board.insert(fixPos.x, fixPos.y, piece.possiblePositions[pieceRotation], piece.id);
      usedPieces[pressedPiece] = true;
      pressedPiece = null;
    }
  } else if (fixPos.x >= 0 && fixPos. x < 10 && fixPos.y >= 0 && fixPos.y < 6) {
    if (board.painted[fixPos.x][fixPos.y] > 0) {
      pressedPiece = board.painted[fixPos.x][fixPos.y] - 1;
      board.removeColor(pressedPiece + 1);
      usedPieces[pressedPiece] = false;
    }
  } else {
    for (let i = 0; i < buttonsPos.length; ++i) {
      let currButton = buttonsPos[i];
      if (currButton.x <= pos.x && pos.x <= currButton.x + 5) {
        if (currButton.y <= pos.y && pos.y <= currButton.y + 4){
          pressedPiece = i;
          piecesRotations[pressedPiece] = 0;
          break;
        }
      }
    }
  }
}

function keyPressed(){
  if (key == "Escape") {
    pressedPiece = null;
    usedPieces = {};
    for (let i = 0 ; i < PIECES_MAP.length; ++i) {
      board.removeColor(i + 1);
    }
    return;
  }

  if (pressedPiece != null) {
    if (key === 'q' || key === 'Q') {
      let piece = pieces[pressedPiece];
      piecesRotations[pressedPiece]++;
      if (piecesRotations[pressedPiece] >= piece.possiblePositions.length)
        piecesRotations[pressedPiece] = 0;
    } else if (key === 'e' || key === 'E') {
      let piece = pieces[pressedPiece];
      piecesRotations[pressedPiece]--;
      if (piecesRotations[pressedPiece] < 0)
        piecesRotations[pressedPiece] = piece.possiblePositions.length - 1;
    }
  }
}