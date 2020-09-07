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

function setup() {
  piecesColors = [
    color('magenta'),
    color('blue'),
    color('yellow'),
    color('red'),
    color('purple'),
    color('black'),
    color('red'),
    color('green'),
    color('cyan'),
    color('gray'),
    color('pink'),
    color('brown')
  ]
  createCanvas(500, 500);
  frameRate(1);

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
}

function draw() {
  background(110);
  for (let i = 0 ; i < piecesPositions.length; ++i) {
    fill(55);
    let pos = new Position(6 * (i % 4) + 1, 7 + ((int)(i / 4) * 5) + 2);
    rect(pos.x * TILE_WIDTH, pos.y * TILE_WIDTH, 100, 80);
    if (i == 0)
      pieces[i].draw(pos.x, pos.y + 1, 0)
    else if (i == 1) 
      pieces[i].draw(pos.x, pos.y, 3)
    else if (i == 9)
      pieces[i].draw(pos.x, pos.y, 1);
    else 
      pieces[i].draw(pos.x, pos.y, 0);
  }
  board.draw(7, 1);
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
    for (let i = 0;  i < tiles.length; ++i){
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