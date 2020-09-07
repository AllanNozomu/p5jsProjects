let piecesColors;

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
// let piecesPositions = [];
let nextPosition;
let pressedPiece;

function setup() {
  piecesColors = [
    color('magenta'),
    color('blue'),
    color('yellow'),
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
  }
}

function draw() {
  background(220);
  
  board.draw(7, 1);
  for (let i = 0 ; i < PIECES_MAP.length; ++i) {
    
    let pos = buttonsPos[i];

    fill(110);
    rect(pos.x * TILE_WIDTH, pos.y * TILE_WIDTH, 100, 80);

    if (pressedPiece != null && i === pressedPiece) {
      console.log(pressedPiece);
      let dragPos = new Position(Math.floor(mouseX / TILE_WIDTH), Math.floor(mouseY / TILE_WIDTH));
      pieces[i].draw(dragPos.x, dragPos.y, 0);
      continue;
    }

    if (i == 0)
      pieces[i].draw(pos.x, pos.y + 1, 0)
    else 
      pieces[i].draw(pos.x, pos.y, 0);
  }
  
}

function Board(tiles = [], rows = 0, columns = 0){
  this.tiles = tiles.sort();
  this.painted = {};
  this.usedPieces = tiles.map(() => false);
  this.usedPiecesCount = 0;
  this.done = false;

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
        fill(color(220));
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
  let pos = new Position(Math.floor(mouseX / TILE_WIDTH), Math.floor(mouseY / TILE_WIDTH));

  if (pressedPiece != null) {
    let piece = pieces[pressedPiece];
    let fixPos = new Position(pos.x - 7, pos.y - 1);

    if (fixPos.x < 0 || fixPos. x > 10 || fixPos.y < 0 || fixPos > 6) {
      pressedPiece = null;
      return;
    }
    if (board.canInsert(fixPos.x, fixPos.y, piece.possiblePositions[0])) {
      board.insert(fixPos.x, fixPos.y, piece.possiblePositions[0], piece.id);
      pressedPiece = null;
    }
  } else {
    for (let i = 0; i < buttonsPos.length; ++i) {
      let currButton = buttonsPos[i];
      if (currButton.x <= pos.x && pos.x <= currButton.x + 5) {
        if (currButton.y <= pos.y && pos.y <= currButton.y + 4){
          pressedPiece = i;
          break;
        }
      }
    }
  }
}