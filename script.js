const board = document.getElementById('board');
const statusText = document.getElementById('status');
const modeRadios = document.querySelectorAll('input[name="mode"]');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let isGameActive = true;
let isVsComputer = false;

const xImage = 'x.png';
const oImage = 'o.png';

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = '';
  gameState = Array(9).fill(null);
  isGameActive = true;
  currentPlayer = 'X';

  modeRadios.forEach(radio => {
    if (radio.checked) isVsComputer = radio.value === "computer";
  });

  statusText.textContent = isVsComputer
    ? "Your turn (X)"
    : "Player X's turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!isGameActive || gameState[index]) return;

  makeMove(index, currentPlayer);

  if (checkWin()) {
    statusText.textContent = currentPlayer === 'X' ? "Player X wins!" : "Player O wins!";
    isGameActive = false;
    return;
  }

  if (!gameState.includes(null)) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = isVsComputer
    ? (currentPlayer === 'O' ? "Computer's turn" : "Your turn (X)")
    : `Player ${currentPlayer}'s turn`;

  if (isVsComputer && currentPlayer === 'O') {
    setTimeout(computerMove, 300);
  }
}

function makeMove(index, player) {
  const cell = board.children[index];
  const img = document.createElement('img');
  img.src = player === 'X' ? xImage : oImage;
  cell.appendChild(img);
  gameState[index] = player;
}

function computerMove() {
  if (!isGameActive) return;

  const bestMove = findBestMove();
  makeMove(bestMove, 'O');

  if (checkWin()) {
    statusText.textContent = "Computer wins!";
    isGameActive = false;
    return;
  }

  if (!gameState.includes(null)) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = "Your turn (X)";
}

// -------- Minimax AI Logic --------
function findBestMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (gameState[i] === null) {
      gameState[i] = 'O';
      let score = minimax(gameState, 0, false);
      gameState[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(state, depth, isMaximizing) {
  if (checkWinFor('O', state)) return 10 - depth;
  if (checkWinFor('X', state)) return depth - 10;
  if (!state.includes(null)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === null) {
        state[i] = 'O';
        let eval = minimax(state, depth + 1, false);
        state[i] = null;
        maxEval = Math.max(maxEval, eval);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === null) {
        state[i] = 'X';
        let eval = minimax(state, depth + 1, true);
        state[i] = null;
        minEval = Math.min(minEval, eval);
      }
    }
    return minEval;
  }
}

function checkWinFor(player, state) {
  return winConditions.some(([a, b, c]) =>
    state[a] === player && state[b] === player && state[c] === player
  );
}

// -------- Utility Functions --------
function checkWin() {
  return winConditions.some(([a, b, c]) =>
    gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]
  );
}

function resetGame() {
  createBoard();
}

modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    resetGame();
  });
});

createBoard();
