function Piece(id=0, tiles = [], c = color("white")){
  this.id = id;
  this.tiles = tiles;
  this.color = c;
  this.possiblePositions = [];
  
  this.horizontalReverse = () => {
    if (id === 1) return;
    let maxValue = 0;
    
    this.tiles.map((position) => {
      maxValue = max(maxValue, position.x);
      position.x *= -1;
    });
    
    this.tiles.map((position) => {
      position.x += maxValue;
    });
  }
  
  this.rotate = () => {
    if (id === 1) return;
    this.tiles.map((position) => {
      let aux = position.y;
      position.y = position.x;
      position.x = aux;
    });
    this.horizontalReverse();
    this.moveTo00
  }
  
  this.moveTo00 = () => {
    this.tiles.sort((a,b) => {
      if (a.x == b.x) return a.y - b.y;
      return a.x - b.x;
    });
    let yMin = tiles[0].y;
    this.tiles.forEach(position => {
      position.y -= yMin;
    });
  }
  
  
  this.draw = (x = 0, y = 0) => {
    this.tiles.forEach((position) => {
      fill(this.color);
      rect((position.x + x)*TILE_WIDTH, (position.y + y)*TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
    });
  }
  
  // Draw based on the possible position index
  this.draw = (x, y, index) => {
    this.possiblePositions[index].forEach((position) => {
      fill(this.color);
      rect((position.x + x)*TILE_WIDTH, (position.y + y)*TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
    });
  }
  

  // Make all the possibilities of the piece, based on rotation
  for (let i = 0 ; i < 4; ++i) {
    // Check for repeated positions
    let possiblePosition = this.tiles.map(pos => new Position(pos.x, pos.y));
    if (this.possiblePositions.filter(pp => {
      // Filter if the current tiles match any of the possiblePositions saved ones
      for (let j = 0; j < pp.length; ++j) {
        if (pp[j].x != possiblePosition[j].x || pp[j].y != possiblePosition[j].y) return false;
      }
      return true;
    }).length == 0)
      this.possiblePositions.push(possiblePosition);
    this.rotate();
  }
  // Make all the possibilities, but now reversed
  this.horizontalReverse();
  for (let i = 0 ; i < 4; ++i) {
    this.rotate();
    let possiblePosition = this.tiles.map(pos => new Position(pos.x, pos.y));
    if (this.possiblePositions.filter(pp => {
      for (let j = 0; j < pp.length; ++j) {
        if (pp[j].x != possiblePosition[j].x || pp[j].y != possiblePosition[j].y) return false;
      }
      return true;
    }).length == 0)
      this.possiblePositions.push(possiblePosition);
  }
}