let board;
let boardBefore;

function setup() {
  createCanvas(460, 460);
  frameRate(30);
  board = [[5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0], [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6], [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]];
  boardBefore = JSON.parse(JSON.stringify(board));
  solveSudoku(board);
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
      if (boardBefore[i][j] != 0) {
        strokeWeight(2);
        stroke(1);
      }
      else {
        strokeWeight(0);
        stroke(0);
      }
      text(board[i][j], i * 40 + 50 + (textWidth(board[i][j]) / 2), j * 40 + 50 + 34)
    }
  }
}

function solveSudoku(board) {
  solveSudokuAux(board, 0, 0);
}

function solveSudokuAux(board, r, c) {
  if (r == 9) {
    return true;
  }

  if (board[r][c] == 0) {
    for (let i = 1; i <= 9; ++i) {
      board[r][c] = i;
      if (checkRow(board, r) && checkCol(board, c) && checkGrid(board, r, c)) {
        if (solveSudokuAux(board, (c == 8) ? r + 1 : r, (c + 1) % 9)) return true;
      }
    }
    board[r][c] = 0;
    return false;
  }

  return solveSudokuAux(board, (c == 8) ? r + 1 : r, (c + 1) % 9);
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