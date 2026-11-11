import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { Player } from './player.js';
import { Gameplay, placePlayerShip } from './gameplay.js';
import { startPvpGame } from '../index.js';

export {
  renderPlayerBoard,
  renderTargetBoard,
  createGameArea,
  createMainMenu,
  createGameOverModal,
  createTurnOverModal,
  calculateCellName,
  createPlayerInputs,
  renderPlacementBoard
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
}

function createBoardLabels(container) {
  const letters = 'ABCDEFGHIJ'.split('');

  const columnLabels = document.createElement('div');
  columnLabels.classList.add('column-labels');

  letters.forEach((letter) => {
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

  // Create wrapper
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container');

  // Create actual game board
  const boardElement = document.createElement('div');
  boardElement.classList.add('game-board');

  // Generate labels inside wrapper
  createBoardLabels(boardContainer);

  // Generate empty cells
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');

      cell.classList.add('cell');

      boardElement.appendChild(cell);
    }
  }

  // Append board to wrapper
  boardContainer.appendChild(boardElement);

  // Append wrapper to container
  container.appendChild(boardContainer);
}

function renderPlacementBoard(player, renderboards) {
    let placedShipCount = 0
  let selectedShip = null;
  let selectedDirection = 'x';
  let selectedButton = null;
  let hoveredCell = null;
  const container = document.querySelector('#player-board');
  container.replaceChildren();

  // Create wrapper
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container', 'placement');

  // Create actual game board
  const boardElement = document.createElement('div');
  boardElement.classList.add('game-board', 'placement');

  boardElement.addEventListener('mouseleave', () => {
    hoveredCell = null;

    boardElement.querySelectorAll('.cell').forEach((cell) => {
      cell.classList.remove('preview', 'invalid-preview');
    });
  });
  // Generate labels inside wrapper
  createBoardLabels(boardContainer);

  // Generate empty cells
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');

      cell.classList.add('cell');

      boardElement.appendChild(cell);
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', () => {
        if (!selectedShip) return;

        const valid = previewShip(x, y);
        if (!valid) return;

        const placed = placePlayerShip(
          player,
          selectedShip.name,
          selectedShip.length,
          x,
          y,
          selectedDirection
        );
        if (!placed) return;
        selectedButton.remove();
        placedShipCount++

        for (let i = 0; i < selectedShip.length; i++) {
          const cellX = selectedDirection === 'x' ? x + i : x;
          const cellY = selectedDirection === 'y' ? y + i : y;

          const cell = boardElement.querySelector(
            `[data-x="${cellX}"][data-y="${cellY}"]`
          );

          cell.classList.add('ship');
        }

        selectedShip = null;
        selectedButton = null;
      });
      cell.addEventListener('mouseenter', () => {
        hoveredCell = { x, y };
        previewShip(x, y);
      });

      cell.addEventListener('mouseleave', () => {
        cell.classList.remove('preview', 'invalid-preview');
      });
    }
  }

  // Append board to wrapper
  boardContainer.appendChild(boardElement);

  // Append wrapper to container
  container.appendChild(boardContainer);
  renderShipSelect(
    container,
    (ship, button) => {
      selectedShip = ship;
      selectedButton = button;
    },
    rotateShip,
    renderboards,
    getPlacedShipCount
  );

  function previewShip(x, y) {
    if (!selectedShip) return false;
    // Clear previous preview
    boardElement.querySelectorAll('.cell').forEach((cell) => {
      cell.classList.remove('preview', 'invalid-preview');
    });

    if (!selectedShip) return;

    const length = selectedShip.length;
    const previewCells = [];
    let valid = true;

    for (let i = 0; i < length; i++) {
      // Calculate position based on direction
      const cellX = selectedDirection === 'x' ? x + i : x;
      const cellY = selectedDirection === 'y' ? y + i : y;

      // Check boundaries
      if (cellX >= 10 || cellY >= 10) {
        valid = false;
        continue;
      }

      // Check whether cell is occupied
      if (player.board.board[cellY][cellX] !== null) {
        valid = false;
      }

      const cell = boardElement.querySelector(
        `[data-x="${cellX}"][data-y="${cellY}"]`
      );

      if (cell) {
        previewCells.push(cell);
      }
    }

    // Highlight all preview cells
    previewCells.forEach((cell) => {
      cell.classList.add(valid ? 'preview' : 'invalid-preview');
    });

    return valid;
  }
  function rotateShip() {
    selectedDirection = selectedDirection === 'x' ? 'y' : 'x';

    if (hoveredCell && selectedShip) {
      previewShip(hoveredCell.x, hoveredCell.y);
    }
  }
  
  function getPlacedShipCount() {
    return placedShipCount;
  }

  return { rotateShip };
}

function renderShipSelect(container, onSelectShip, onRotateShip, onRenderBoards, onGetPlacedShipCount) {

  const bottomArea = document.createElement('div');
  const selectArea = document.createElement('div');
  selectArea.id = 'select-area';
  bottomArea.id = 'bottom-area';

  container.appendChild(bottomArea);
  bottomArea.appendChild(selectArea);

  const titleArea = document.createElement('div');
  const title = document.createElement('p');
  title.textContent = 'Select a ship';

  selectArea.appendChild(titleArea);
  titleArea.appendChild(title);

  const shipArea = document.createElement('div');

  selectArea.appendChild(shipArea);

  const shipsArray = [
    { name: 'Carrier', length: 5 },
    { name: 'Battleship', length: 4 },
    { name: 'Submarine', length: 3 },
    { name: 'Cruiser', length: 2 },
    { name: 'Destroyer', length: 2 }
  ];

  let selectedShip = null;

  for (const ship of shipsArray) {
    const shipContainer = document.createElement('button');
    shipContainer.type = 'button';
    shipContainer.dataset.shipName = ship.name;
    shipContainer.classList.add('selection', 'ship-container');
    const shipName = document.createElement('p');
    shipName.textContent = ship.name;
    const shipCellContainer = document.createElement('div');
    shipCellContainer.classList.add('cell-container');

    shipArea.appendChild(shipContainer);
    shipContainer.append(shipName, shipCellContainer);

    for (let i = 0; i < ship.length; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell', 'selection');
      shipCellContainer.appendChild(cell);
    }
    shipContainer.addEventListener('click', () => {
      document
        .querySelectorAll('.ship-container')
        .forEach((button) => button.classList.remove('selected'));

      shipContainer.classList.add('selected');

      selectedShip = ship;

      onSelectShip(selectedShip, shipContainer);
    });
  }

  const buttonArea = document.createElement('div');
  buttonArea.id = 'btn-area';
  bottomArea.appendChild(buttonArea);

  const readyBtn = document.createElement('button');
  buttonArea.appendChild(readyBtn);
  readyBtn.textContent = 'Start Test';

  readyBtn.addEventListener('click', () => {
    if (onGetPlacedShipCount() >= shipsArray.length) {
    onRenderBoards();}
    else {console.log("Place all ships" + onGetPlacedShipCount())}
  });

  const rotateButton = document.createElement('button');
  rotateButton.textContent = 'Rotate Ship (R)';

  rotateButton.addEventListener('click', onRotateShip);

  buttonArea.appendChild(rotateButton);
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
  and sinks ${opponent.name}'s ${result.ship.shipName}`;
  }

  modal.showModal();
}

function calculateCellName({ x, y }) {
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}
