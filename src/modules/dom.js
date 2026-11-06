import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { Player } from './player.js';
import { Gameplay } from './gameplay.js';
import { startPvpGame } from '../index.js';

export {
  renderPlayerBoard,
  renderTargetBoard,
  createGameArea,
  createMainMenu,
  createGameOverModal,
  createTurnOverModal,
  calculateCellName,
  createPlayerInputs
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

  // const testPlayerSwitch = document.createElement('button');
  // testPlayerSwitch.textContent = 'Swap Player';
  // testPlayerSwitch.addEventListener('click', onSwapPlayer);

  // boardArea.appendChild(testPlayerSwitch);
}

function createBoardLabels(container) {
  const letters = 'ABCDEFGHIJ'.split('');

  const columnLabels = document.createElement('div');
  columnLabels.classList.add('column-labels');

  letters.forEach(letter => {
    const label = document.createElement('div');
    label.textContent = letter;
    columnLabels.appendChild(label);
  });

  const rowLabels = document.createElement('div');
  rowLabels.classList.add('row-labels');

  for (let i = 1; i <= 10; i++) {
    const label = document.createElement('div');
    label.textContent = i;
    rowLabels.appendChild(label);
  }

  container.append(columnLabels, rowLabels);
}

function renderBoard(player, container, hideShips = false, onCellClick = null) {
  const board = player.board.board;

  container.replaceChildren();

  // Create wrapper
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container');

  // Create actual game board
  const boardElement = document.createElement('div');
  boardElement.classList.add('game-board');

  // Generate labels inside wrapper
  createBoardLabels(boardContainer);

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cellState = board[y][x];
      const cell = document.createElement('div');

      cell.classList.add('cell');

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

      boardElement.appendChild(cell);
    }
  }

  // Append board and wrapper
  boardContainer.appendChild(boardElement);
  container.appendChild(boardContainer);
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
  document.body.innerHTML = '';
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

  pvpBtn.addEventListener('click', () => {
    createPlayerInputs();
  });
}

function createPlayerInputs() {
  document.body.innerHTML = '';
  const modal = document.createElement('dialog');
  modal.id = 'start-modal';
  modal.classList.add('modal');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const title = document.createElement('h2');
  title.textContent = 'Battleship';

  const playerOneLabel = document.createElement('label');
  playerOneLabel.textContent = 'Player 1 Name';

  const playerOneInput = document.createElement('input');
  playerOneInput.type = 'text';
  playerOneInput.placeholder = 'Enter player 1 name';
  playerOneInput.maxLength = 15;
  playerOneInput.required = true;

  const playerTwoLabel = document.createElement('label');
  playerTwoLabel.textContent = 'Player 2 Name';

  const playerTwoInput = document.createElement('input');
  playerTwoInput.type = 'text';
  playerTwoInput.placeholder = 'Enter player 2 name';
  playerTwoInput.maxLength = 15;
  playerTwoInput.required = true;

  const startButton = document.createElement('button');
  startButton.textContent = 'Start Game';

  startButton.addEventListener('click', () => {
    const playerOneName = playerOneInput.value.trim();
    const playerTwoName = playerTwoInput.value.trim();

    if (!playerOneName || !playerTwoName) {
      alert('Both players must enter a name!');
      return;
    }

    modal.close();
    startPvpGame(playerOneName, playerTwoName);
    modal.remove();
  });

  modalContent.append(
    title,
    playerOneLabel,
    playerOneInput,
    playerTwoLabel,
    playerTwoInput,
    startButton
  );

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.showModal();
}

function createGameOverModal(currentPlayer, opponent) {
  const modal = document.createElement('dialog');
  modal.id = 'game-over';
  modal.classList.add('modal');
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  const title = document.createElement('p');
  title.id = 'title';
  const subText = document.createElement('p');

  title.textContent = 'GAME OVER';
  subText.textContent = `${currentPlayer.name} Wins!`;

  const mainMenuBtn = document.createElement('button');
  mainMenuBtn.textContent = 'Main Menu';

  mainMenuBtn.addEventListener('click', () => {
    modal.close();
    modal.remove();
    createMainMenu();
  });

  document.body.appendChild(modal);
  modal.appendChild(modalContent);
  modalContent.append(title, subText, mainMenuBtn);
  modal.showModal();
}


function createTurnOverModal(currentPlayer, result, opponent, onSwapPlayer) {
  const modal = document.createElement('dialog');
  modal.id = 'turn-over';
  modal.classList.add('modal');
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  const title = document.createElement('p');
  title.id = result.result;
  const subText = document.createElement('p');

  const nextTurnBtn = document.createElement('button');
  nextTurnBtn.textContent = `Begin ${opponent.name}'s turn`;

  nextTurnBtn.addEventListener('click', () => {
    modal.close();
    modal.remove();
    onSwapPlayer();
  });

  document.body.appendChild(modal);
  modal.appendChild(modalContent);
  modalContent.append(title, subText);
  modalContent.append(nextTurnBtn);
  renderTransitionBoards();

  switch (result.result) {
    case 'hit':
      title.textContent = 'Hit!';
      break;

    case 'miss':
      title.textContent = 'Miss..';
  }

  subText.textContent = `${currentPlayer.name} strikes
   ${calculateCellName(result.coordinates)} 
  and gets a ${result.result}`;

  if (result.sunk == true) {
    title.textContent = 'Sunk!';
    subText.textContent = `${currentPlayer.name} strikes
   ${calculateCellName(result.coordinates)} 
  and sinks ${opponent.name}'s ${calculateShipName(result.shipLength)}`;
  }

  modal.showModal();
}

function calculateCellName({ x, y }) {
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}

function calculateShipName(shipLength) {
  let shipName = null;
  switch (shipLength) {
    case 2:
      shipName = 'Destroyer';
      break;
    case 3:
      shipName = 'Submarine';
      break;
    case 4:
      shipName = 'Battleship';
      break;
    case 5:
      shipName = 'Carrier';
  }
  return shipName;
}
