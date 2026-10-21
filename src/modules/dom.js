import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { Player } from './player.js';
import { Gameplay } from './gameplay.js';

export { renderPlayerBoard, renderTargetBoard, createGameArea };


function createGameArea(onSwapPlayer) {
  const boardArea = document.createElement('div');
  boardArea.id = 'game-area';
  const targetBoard = document.createElement('div');
  targetBoard.id = 'target-board';
  const playerBoard = document.createElement('div');
  playerBoard.id = 'player-board';

  document.body.appendChild(boardArea);

  boardArea.append(targetBoard, playerBoard)

  const testPlayerSwitch = document.createElement("button");
  testPlayerSwitch.textContent = "Swap Player"
  testPlayerSwitch.addEventListener("click", onSwapPlayer);

  boardArea.appendChild(testPlayerSwitch)
}

function renderBoard(player, container, hideShips = false, onCellClick = null) {
  const board = player.board.board;

  container.replaceChildren();
  container.classList.add('game-board');

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cellState = board[y][x];
      const cell = document.createElement('div');

      cell.classList.add('cell');

      // Store coordinates for later click handling.
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (cellState === 'hit') {
        cell.classList.add('hit');
      } else if (cellState === 'miss') {
        cell.classList.add('miss');
      } else if (cellState !== null && !hideShips) {
        cell.classList.add('ship');
      }

      if (onCellClick){
        cell.addEventListener("click", () => onCellClick(x,y))
      }

      container.appendChild(cell);
    }
  }
}

function renderPlayerBoard(player) {
  const container = document.querySelector('#player-board');

  renderBoard(player, container, false);
}

function renderTargetBoard(player, targetPlayer, onCellClick) {
  const container = document.querySelector('#target-board');

  renderBoard(targetPlayer, container, true, onCellClick);
}
