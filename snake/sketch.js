const TILE_WIDTH = 20;
const DIRECTIONS = {
    "UP" : [0, -1],
    "DOWN" : [0, 1],
    "LEFT" : [-1, 0],
    "RIGHT" : [1, 0]
};

let snake;
let food;

function setup() {
    createCanvas(480, 480);
    frameRate(10);

    snake = new Snake(9, 9);
    food = new Food();
    food.getNewPosition(snake.tiles);
}

function draw() {
    background(220);

    snake.update();
    if (snake.position.x === food.position.x && snake.position.y === food.position.y) {
        snake.tiles.push(new Position(snake.position.x, snake.position.y));
        food.getNewPosition(snake.tiles);
        snake.draw();
    }
    
    snake.draw();
    food.draw();
}

function Snake(x, y) {
    this.position = new Position(x, y);
    this.tiles = [new Position(x, y)];
    this.direction = DIRECTIONS.UP;
    
    this.draw = () => {
        fill("green");
        this.tiles.forEach(t => {
            rect(t.x * TILE_WIDTH, t.y * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
        });
    }

    this.update = () => {
        this.position.x += this.direction[0];
        this.position.y += this.direction[1];

        this.tiles.shift();
        this.tiles.push(new Position(this.position.x, this.position.y));
    }
}

function Food() {
    this.position = new Position(0,0);

    this.getNewPosition= (usedTiles) => {
        let success = false;
        let x, y;

        while(!success) {
            success = true;
            x = Math.floor(random(0, 20));
            y = Math.floor(random(0, 20));
            
            for (let i = 0; i < usedTiles.length; ++i){
                let curr = usedTiles[i];
                if (curr.x === x && curr.y === y){
                    success = false;
                    break;
                }
            }
        }
        this.position = new Position(x, y);
    }

    this.draw = () => {
        fill("red");
        rect(this.position.x * TILE_WIDTH, this.position.y * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
    }

    
}

function Position(x, y) {
    this.x = x;
    this.y = y;
}

const KEYS = {
    "w" : DIRECTIONS.UP,
    "a" : DIRECTIONS.LEFT,
    "s" : DIRECTIONS.DOWN,
    "d" : DIRECTIONS.RIGHT
}
function keyPressed() {
    let pressed_key = key.toLowerCase();
    snake.direction = KEYS[pressed_key];
}