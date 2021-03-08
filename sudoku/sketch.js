function Position(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}

let board;
let boardBefore;
let selected = null;
let value = 0;
let toggleResolution = false;

function setup() {
  createCanvas(460, 460);
  frameRate(30);
  board = [[5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0], [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6], [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]];
  boardBefore = JSON.parse(JSON.stringify(board));
  solveSudoku(board);
  console.log(board)
}

function draw() {
  background(220);
  fill(255)
  strokeWeight(5);
  rect(50, 50, 360, 360)

  fill(1)
  textSize(36)

  for (let i = 0; i < 9; ++i) {
    let lineSize = (i + 1) * 40 + 50;
    if ((i + 1) % 3 == 0) {
      strokeWeight(5);
    } else {
      strokeWeight(1);
    }
    line(50, lineSize, 410, lineSize)
    line(lineSize, 50, lineSize, 410)

    for (let j = 0; j < 9; ++j) {
      if (selected != null && selected.x == i && selected.y == j) {
        strokeWeight(0);
        fill("YELLOW")
        rect(i * 40 + 55, j * 40 + 55, 30, 30)
        fill("BLACK")
      }

      if (toggleResolution && boardBefore[i][j] == 0) continue
      if (board[i][j] == 0) continue;

      if (boardBefore[i][j] != 0) {
        strokeWeight(2);
        stroke(1);
      } else {
        strokeWeight(0);
        stroke(0);
      }
      if (selected != undefined && selected.x == i && selected.y == j) {
        fill("RED")
      } else {
        fill(1)
      }
      text(board[i][j], i * 40 + 50 + (textWidth(board[i][j]) / 2), j * 40 + 50 + 34)
    }
  }
}

function solveSudoku(board) {
  if (!checkBoard(board)) return false;
  return solveSudokuAux(board, 0, 0);
}

function solveSudokuAux(board, r, c) {
  if (r == 9) {
    return true;
  }

  if (board[r][c] == 0) {
    let available = availableNumbers(board, r, c);
    for (let i = 0; i < available.length; ++i) {
      board[r][c] = available[i];
      if (solveSudokuAux(board, (c == 8) ? r + 1 : r, (c + 1) % 9)) return true;
    }
    board[r][c] = 0;
    return false;
  }

  return solveSudokuAux(board, (c == 8) ? r + 1 : r, (c + 1) % 9);
}

function availableNumbers(board, row, col) {
  let visited = [false, false, false, false, false, false, false, false, false, false]
  board[row].forEach(c => {
    visited[c] = true;
  });
  board.forEach(r => {
    visited[r[col]] = true;
  })
  row = (int)(row / 3) * 3;
  col = (int)(col / 3) * 3;

  for (let r = row; r < row + 3; ++r) {
    for (let c = col; c < col + 3; ++c) {
      visited[board[r][c]] = true;
    }
  }

  res = []
  for (let i = 1; i <= 9; ++i)
    if (!visited[i]) res.push(i)
  return res;
}

function checkBoard(board) {
  for (let i = 0; i < 9; ++i) {
    if (!checkRow(board, i)) return false;
    if (!checkCol(board, i)) return false;
    for (let j = 0; j < 9; ++j) {
      if (!checkGrid(board, i, j)) return false;
    }
  }
  return true;
}

function checkRow(board, row) {
  let visited = [false, false, false, false, false, false, false, false, false, false]

  let res = true;

  board[row].forEach(c => {
    if (c == 0) return;
    if (visited[c]) {
      res = res && false;
      return;
    }
    visited[c] = true;
  });
  return res;
}

function checkCol(board, col) {
  let visited = [false, false, false, false, false, false, false, false, false, false]

  let res = true;

  board.forEach(row => {
    if (row[col] == 0) return;
    if (visited[row[col]]) {
      res = res && false;
      return;
    }
    visited[row[col]] = true;
  });
  return res;
}

function checkGrid(board, row, col) {
  row = (int)(row / 3) * 3;
  col = (int)(col / 3) * 3;
  let visited = [false, false, false, false, false, false, false, false, false, false]

  for (let r = row; r < row + 3; ++r) {
    for (let c = col; c < col + 3; ++c) {
      if (board[r][c] == 0) continue;
      if (visited[board[r][c]]) {
        return false;
      }
      visited[board[r][c]] = true;
    }
  }
  return true;
}

function mousePressed() {
  if (mouseButton !== LEFT) return;
  if (mouseX < 50 || mouseY < 50 || mouseX > 450 || mouseY > 450) return;

  selected = new Position(Math.floor((mouseX - 50) / 40), Math.floor((mouseY - 50) / 40));
}

function keyPressed() {
  if (key == "Enter") {
    if (selected == null) return;
    boardBefore[selected.x][selected.y] = value;
    board = JSON.parse(JSON.stringify(boardBefore));

    if (!solveSudoku(board)) {
      alert("Impossible Sudoku!")
    }
    toggleResolution = false;
    selected = null;
    value = 0;
    return;
  }
  if (key == "Escape") {
    board.forEach(r => {
      for (let i = 0; i < r.length; ++i) {
        r[i] = 0;
      }
    });
    boardBefore = JSON.parse(JSON.stringify(board));
    return;
  }
  if (key == 'V' || key == 'v') {
    toggleResolution = !toggleResolution;
    return;
  }

  if (selected != null) {

    let keyValue = key.charCodeAt(0) - '0'.charCodeAt(0);
    if (keyValue < 0 || keyValue > 9) return;

    value = keyValue;
    board[selected.x][selected.y] = value;
    boardBefore[selected.x][selected.y] = value;
  }
}