import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { Player } from './player.js';
import { Gameplay } from './gameplay.js';

export {
  renderPlayerBoard,
  renderTargetBoard,
  createGameArea,
  createMainMenu,
  createGameOverModal,
  createTurnOverModal,
  calculateCellName
};

function createGameArea(onSwapPlayer) {
  const boardArea = document.createElement('div');
  boardArea.id = 'game-area';
  const targetBoard = document.createElement('div');
  targetBoard.id = 'target-board';
  const playerBoard = document.createElement('div');
  playerBoard.id = 'player-board';

  document.body.appendChild(boardArea);

  boardArea.append(targetBoard, playerBoard);

  const testPlayerSwitch = document.createElement('button');
  testPlayerSwitch.textContent = 'Swap Player';
  testPlayerSwitch.addEventListener('click', onSwapPlayer);

  boardArea.appendChild(testPlayerSwitch);
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

      if (onCellClick) {
        cell.addEventListener('click', () => onCellClick(x, y));
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

function renderTransitionBoards() {
  const container1 = document.querySelector('#player-board');
  const container2 = document.querySelector('#target-board');
  renderEmptyBoard(container1);
  renderEmptyBoard(container2);
}

function renderEmptyBoard(container) {
  container.replaceChildren();
  container.classList.add('game-board');

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');

      cell.classList.add('cell');

      container.appendChild(cell);
    }
  }
}

function createMainMenu() {
  const menu = document.createElement('div');
  menu.id = 'main-menu';
  const menuButtons = document.createElement('div');
  menuButtons.id = 'menu-btns';
  const pvpBtn = document.createElement('button');
  pvpBtn.textContent = 'Player Vs. Player';
  pvpBtn.id = 'pvp';
  pvpBtn.classList.add('menu-btn');
  const pveBtn = document.createElement('button');
  pveBtn.textContent = 'Player Vs. Computer';
  pveBtn.id = 'pve';
  pveBtn.classList.add('menu-btn');

  document.body.appendChild(menu);
  menu.appendChild(menuButtons);
  menuButtons.appendChild(pvpBtn);
  menuButtons.appendChild(pveBtn);
}

function createGameOverModal(currentPlayer) {
  const gameOverModal = document.createElement('dialog');
  gameOverModal.id = 'game-over';
  gameOverModal.classList.add('modal');
  const gameOverText = document.createElement('p');
  gameOverText.textContent = 'Game Over';
  const mainMenuButton = document.createElement('button');
  mainMenuButton.textContent = 'Main Menu';

  gameOverModal.appendChild(gameOverText);
  gameOverModal.appendChild(mainMenuButton);
}

function createTurnOverModal(currentPlayer, result) {
  const modal = document.createElement('dialog');
  modal.id = 'turn-over';
  modal.classList.add('modal');
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  const title = document.createElement('p');
  title.id = result.result;
  const subText = document.createElement('p');

  document.body.appendChild(modal);
  modal.appendChild(modalContent);
  modalContent.append(title, subText);
  renderTransitionBoards();

  subText.textContent = `${currentPlayer.name} strikes
   ${calculateCellName(result.coordinates)} 
  and gets a ${result.result}`;

  switch (result.result) {
    case 'hit':
      title.textContent = 'Hit!';

    case 'miss':
      title.textContent = 'Miss..';
  }
      modal.showModal();
}

function calculateCellName({ x, y }) {
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}

function calculateShipName(shipLength) {
  console.log(shipLength);
}
