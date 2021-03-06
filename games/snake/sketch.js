const TILE_WIDTH = 24;
const DIRECTIONS = {
    "UP": [0, -1],
    "DOWN": [0, 1],
    "LEFT": [-1, 0],
    "RIGHT": [1, 0]
};

function sameDirection(d1, d2) {
    return (((d1 === DIRECTIONS.UP || d1 === DIRECTIONS.DOWN) && (d2 === DIRECTIONS.UP || d2 === DIRECTIONS.DOWN))
        || ((d1 === DIRECTIONS.LEFT || d1 === DIRECTIONS.RIGHT) && (d2 === DIRECTIONS.LEFT || d2 === DIRECTIONS.RIGHT)))
}

let game;

function setup() {
    createCanvas(480, 480);
    frameRate(10);

    game = new Game();
    game.start();
}

function draw() {
    background(220);
    game.update();
    game.draw();
}

function Game() {
    this.paused = true;
    this.ended = false;
    this.snake = new Snake(9, 9);
    this.food = new Food();
    this.score = 0;

    const KEYS = {
        "w": DIRECTIONS.UP,
        "a": DIRECTIONS.LEFT,
        "s": DIRECTIONS.DOWN,
        "d": DIRECTIONS.RIGHT
    }

    this.start = () => {
        this.paused = true;
        this.finished = false;
        this.snake = new Snake(9, 9);
        this.food = new Food();
        this.food.getNewPosition(this.snake.tiles);
        this.score = 0;
    }

    this.update = () => {
        if (this.finished || this.paused) return;

        this.snake.update();
        if (this.snake.head().x === this.food.position.x && this.snake.head().y === this.food.position.y) {
            this.food.getNewPosition(this.snake.tiles);
            this.snake.grow();
            this.score++;
        }
        if (this.snake.checkCollision()) {
            this.finished = true;
        }
        if (this.snake.head().x < 0 || this.snake.head().y < 0 || this.snake.head().x >= 20 || this.snake.head().y >= 20)
            this.finished = true;
    }

    this.draw = () => {
        this.snake.draw();
        this.food.draw();

        let s;
        fill(0);
        textSize(64);
        if (this.paused) {
            s = "PAUSED";
            text(s, 240 - textWidth(s) / 2, 200);

            textSize(32);
            s = "Press P to continue";
            text(s, 240 - textWidth(s) / 2, 300);
            s = "w, a, s, d to move";
            text(s, 240 - textWidth(s) / 2, 350);
        } else if (this.finished) {
            s = "GAME OVER";
            text(s, 240 - textWidth(s) / 2, 200);
            s = `SCORE ${this.score}`;
            text(s, 240 - textWidth(s) / 2, 300);
            textSize(32);
            s = "Press ESC to play again";
            text(s, 240 - textWidth(s) / 2, 370);
        }
    }

    this.handleClick = (pressed_key) => {
        console.log(pressed_key);
        if (pressed_key === "p") {
            this.paused = !this.paused;
        } else if (pressed_key === "escape") {
            this.start();
        }

        if (!sameDirection(this.snake.direction, KEYS[pressed_key]))
            this.snake.nextDirection = KEYS[pressed_key];
    }
}

function Snake(x, y) {
    this.tiles = [new Position(x, y)];
    this.direction = DIRECTIONS.UP;
    this.nextDirection = null;
    this.isGrowing = false;

    this.head = () => {
        return this.tiles[0];
    }

    this.grow = () => {
        this.isGrowing = true;
    }

    this.update = () => {
        let position = new Position(this.head().x, this.head().y);
        if (this.nextDirection != null) {
            this.direction = this.nextDirection;
        }

        if (!this.isGrowing) {
            this.tiles.pop();
        }
        position.x += this.direction[0];
        position.y += this.direction[1];

        this.tiles.unshift(new Position(position.x, position.y));
        this.isGrowing = false;
    }

    this.checkCollision = () => {
        for (let i = 1; i < this.tiles.length; ++i) {
            if (this.head().x === this.tiles[i].x && this.head().y === this.tiles[i].y) return true;
        }
        return false;
    }

    this.draw = () => {
        fill("green");
        this.tiles.forEach(t => {
            rect(t.x * TILE_WIDTH, t.y * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
        });
    }
}

function Food() {
    this.position = new Position(0, 0);

    this.getNewPosition = (usedTiles) => {
        let success = false;
        let x, y;

        while (!success) {
            success = true;
            x = Math.floor(random(0, 20));
            y = Math.floor(random(0, 20));

            for (let i = 0; i < usedTiles.length; ++i) {
                let curr = usedTiles[i];
                if (curr.x === x && curr.y === y) {
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


function keyPressed() {
    let pressed_key = key.toLowerCase();
    game.handleClick(pressed_key);
}