function Board(tiles = [], rows = 0, columns = 0){
    this.tiles = tiles.sort();
    this.painted = {};
  
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

  this.found = false;
  this.piecesPositions = pieces.map(() => null);
  this.usedPieces = pieces.map(() => false);
  this.usedPiecesCount = 0;

  this.solve = (x, y, pieceIndex, positionIndex) => {
    let currTiles = pieces[pieceIndex].possiblePositions[positionIndex];
    
    if (!this.canInsert(x, y, currTiles)) {
      return;
    } else {
      this.piecesPositions[pieceIndex] = [x, y, positionIndex]
      this.insert(x, y, currTiles, pieceIndex + 1);
      this.usedPieces[pieceIndex] = true;
      this.usedPiecesCount++;
      
      if (this.usedPiecesCount === 12){
        resolutions.push(JSON.parse(JSON.stringify(this.piecesPositions)));
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
      this.piecesPositions[pieceIndex] = null;
      this.remove(x, y, currTiles);
      this.usedPieces[pieceIndex] = false;
      this.usedPiecesCount--;
    }
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