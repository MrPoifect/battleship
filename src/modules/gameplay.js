import { Player } from './player.js';
import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { renderPlayerBoard, renderTargetBoard, createGameArea } from './dom.js';

export { Gameplay };

function Gameplay() {
  let playerOne = null;
  let playerTwo = null;
  let currentPlayer = null;
  function newGame() {
    playerOne = Player('TestP1', 1);
    randomPlaceShips(playerOne);

    playerTwo = Player('TestP2', 2);
    placeTempShips2(playerTwo);

    createGameArea(swapPlayer);

    currentPlayer = playerOne;
    renderBoards();
  }

  function swapPlayer() {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
    } else if (currentPlayer === playerTwo) {
      currentPlayer = playerOne;
    }
    renderBoards();
  }

  function renderBoards() {
    const opponent = currentPlayer === playerOne ? playerTwo : playerOne;

    renderPlayerBoard(currentPlayer);
    renderTargetBoard(currentPlayer, opponent, attack);
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function attack(x, y) {
    const opponent = currentPlayer === playerOne ? playerTwo : playerOne;

    const result = opponent.board.receiveAttack(x, y);

    renderBoards();
  }

  function placeTempShips(player) {
    const shipA = Ship(4);
    const shipB = Ship(6);
    player.board.placeShip(shipA, 0, 0, 'x');
    player.board.placeShip(shipB, 0, 2, 'y');
  }

  function placeTempShips2(player) {
    const shipA = Ship(4);
    const shipB = Ship(6);
    player.board.placeShip(shipA, 4, 0, 'x');
    player.board.placeShip(shipB, 4, 2, 'y');
  }

  return { newGame, swapPlayer, attack };
}

function randomPlaceShips(player) {
  const board = player.board;

  const carrier = Ship(5);
  const battleship = Ship(4);
  const submarine = Ship(3);
  const cruiser = Ship(3);
  const tugBoat = Ship(2);
  const directions = ['x', 'y'];

  const shipsArray = [];
  shipsArray.push(carrier, battleship, submarine, cruiser, tugBoat);

  const maxRetries = 100;

  for (const ship of shipsArray) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < maxRetries) {
      attempts++;
      let randomDirection =
        directions[Math.floor(Math.random() * directions.length)];

      const length = ship.getLength();

      let randomX;
      let randomY;
      if (randomDirection === 'x') {
        randomX = Math.floor(Math.random() * (10 - length + 1));
        randomY = Math.floor(Math.random() * 10);
      } else {
        randomY = Math.floor(Math.random() * (10 - length + 1));
        randomX = Math.floor(Math.random() * 10);
      }

      placed = board.placeShip(ship, randomX, randomY, randomDirection);
    }
  }
}
