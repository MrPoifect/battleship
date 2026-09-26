import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { Player } from './player.js';

export { renderGameBoard, markCell };

const gameArea = document.getElementById('game-area');

function renderGameBoard(player) {
  const board = document.createElement('div');
  board.classList.add('board');
  gameArea.appendChild(board);

  const namePlate = document.createElement('div');
  namePlate.classList.add('name-plate');
  board.appendChild(namePlate);

  const nameText = document.createElement('p');
  nameText.classList.add('name-text');
  nameText.textContent = player.name;
  namePlate.appendChild(nameText);

  const gridArea = document.createElement('div');
  gridArea.classList.add('grid-area');
  board.appendChild(gridArea);

  for (let y = 0; y < 10; y++) {
    const row = document.createElement('div');
    row.classList.add('row');
    gridArea.append(row);
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell', 'column');
      row.appendChild(cell);
      cell.addEventListener('click', () => {
        player.board.recieveAttack(x, y, cell);
      });
    }
  }
}

function markCell(cell, hitType) {
  switch (hitType) {
    case 'hit':
      cell.classList.add('hit');
      break;
    case 'miss':
      cell.classList.add('miss');
  }
}
