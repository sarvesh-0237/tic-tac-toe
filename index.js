const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const playerModeButton = document.getElementById('playerMode');
const aiModeButton = document.getElementById('aiMode');
let oTurn;
let isAiMode = false;
let winningLineElement;

playerModeButton.addEventListener('click', () => startGame(false));
aiModeButton.addEventListener('click', () => startGame(true));
restartButton.addEventListener('click', startGame);

function startGame(aiMode = false) {
  isAiMode = aiMode;
  oTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeAttribute('data-content');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  if (winningLineElement) {
    winningLineElement.remove();
    winningLineElement = null;
  }
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
    drawWinningLine(currentClass);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    if (isAiMode && !oTurn) {
      aiMove();
    }
  }
}

function endGame(draw) {
  if (draw) {
    alert("Draw!");
  } else {
    alert(`${oTurn ? "O's" : "X's"} Wins!`);
  }
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.setAttribute('data-content', currentClass === X_CLASS ? 'X' : 'O');
}

function swapTurns() {
  oTurn = !oTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function drawWinningLine(currentClass) {
  const winningCombination = WINNING_COMBINATIONS.find(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });

  const firstCell = cellElements[winningCombination[0]];
  const lastCell = cellElements[winningCombination[2]];
  const firstCellRect = firstCell.getBoundingClientRect();
  const lastCellRect = lastCell.getBoundingClientRect();

  const horizontal = firstCellRect.top === lastCellRect.top;
  const vertical = firstCellRect.left === lastCellRect.left;
  const diagonal1 = winningCombination.toString() === '0,4,8';
  const diagonal2 = winningCombination.toString() === '2,4,6';

  winningLineElement = document.createElement('div');
  winningLineElement.classList.add('winning-line');

  if (horizontal) {
    winningLineElement.classList.add('line-horizontal');
    winningLineElement.style.top = `${firstCell.offsetTop + firstCell.offsetHeight / 2}px`;
    winningLineElement.style.left = `${board.offsetLeft}px`;
    winningLineElement.style.width = `${board.offsetWidth}px`;
  } else if (vertical) {
    winningLineElement.classList.add('line-vertical');
    winningLineElement.style.left = `${firstCell.offsetLeft + firstCell.offsetWidth / 2}px`;
    winningLineElement.style.top = `${board.offsetTop}px`;
    winningLineElement.style.height = `${board.offsetHeight}px`;
  } else if (diagonal1) {
    winningLineElement.classList.add('line-diagonal', 'line-diagonal-1');
    winningLineElement.style.top = `${board.offsetTop}px`;
    winningLineElement.style.left = `${board.offsetLeft}px`;
    winningLineElement.style.width = `${Math.sqrt(Math.pow(board.offsetWidth, 2) + Math.pow(board.offsetHeight, 2))}px`;
    winningLineElement.style.transform = 'rotate(45deg)';
  } else if (diagonal2) {
    winningLineElement.classList.add('line-diagonal', 'line-diagonal-2');
    winningLineElement.style.top = `${board.offsetTop}px`;
    winningLineElement.style.left = `${board.offsetLeft}px`;
    winningLineElement.style.width = `${Math.sqrt(Math.pow(board.offsetWidth, 2) + Math.pow(board.offsetHeight, 2))}px`;
    winningLineElement.style.transform = 'rotate(-45deg)';
  }

  board.appendChild(winningLineElement);
}

function aiMove() {
  const availableCells = [...cellElements].filter(cell => {
    return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
  });
  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const cell = availableCells[randomIndex];
  placeMark(cell, X_CLASS);
  if (checkWin(X_CLASS)) {
    endGame(false);
    drawWinningLine(X_CLASS);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}