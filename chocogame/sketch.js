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
let resolutionsCount = 0;

function setup() {
  piecesColors = [
    color('magenta'),
    color('blue'),
    color('yellow'),
    color('red'),
    color('purple'),
    color('black'),
    color('white'),
    color('green'),
    color('cyan'),
    color('gray'),
    color('pink'),
    color('brown')
  ]
  createCanvas(1400, 1400);
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
  for (let i = 0 ; i < piecesPositions.length; ++i) {
    for (let j = 0 ; j < pieces[i].possiblePositions.length; ++j) {
      board.solve(0, 0, i, j);
    }
  }
  console.log(resolutionsCount);
}

function draw() {
  background(110);
  // for (let i = 0 ; i < piecesPositions.length; ++i) {
  //   for (let j = 0; j < pieces[i].possiblePositions.length; ++j) {
  //     pieces[i].draw(j * 6 + 11, 2 + 5 * i, j);
  //   }
  // }
  // for (let i = 0; i < resolutions.length; ++i) {
  //   board.draw(0, i * 4, resolutions[i]);
  // }
  board.draw(0, 0, resolutions[0]);
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
  
  this.found = false;
  this.solve = (x, y, pieceIndex, positionIndex) => {
    let currTiles = pieces[pieceIndex].possiblePositions[positionIndex];
    
    if (!this.canInsert(x, y, currTiles)) {
      return;
    } else {
      this.insert(x, y, currTiles, pieceIndex + 1);
      this.usedPieces[pieceIndex] = true;
      this.usedPiecesCount++;
      
      if (this.usedPiecesCount === 12){
        // resolutions.push(JSON.parse(JSON.stringify(this.painted)));
        resolutionsCount++;
      } else {
        let nextPos = this.nextUnused();
        for (let i = 0; i < pieces.length; ++i) {
          if (!this.usedPieces[i]) {
            for (let j = 0; j < pieces[i].possiblePositions.length; ++j) {
              this.solve(nextPos.x, nextPos.y, i, j);
            }
          }
        }
      }

      this.remove(x, y, currTiles);
      this.usedPieces[pieceIndex] = false;
      this.usedPiecesCount--;
    }
  }
  
  this.draw = (x = 0, y = 0, painted = this.painted) => {
    this.tiles.forEach(tile => {
      let color = painted[tile.x][tile.y];
      if (nextPosition != undefined && tile.x === nextPosition.x && tile.y === nextPosition.y) {
        fill(0,255,0);
      } else if (color === 0) {
        fill(255,0,0);
      }else{
        fill(piecesColors[color-1]);
      }
      rect((x + tile.x)*TILE_WIDTH, (y + tile.y)*TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
    })
  }
}

function Position(x = 0, y = 0){
  this.x = x;
  this.y = y;
}