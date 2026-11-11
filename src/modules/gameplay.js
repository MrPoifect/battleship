import { Player } from './player.js';
import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import {
  renderPlayerBoard,
  renderTargetBoard,
  createGameArea,
  createGameOverModal,
  createTurnOverModal,
  calculateCellName
} from './dom.js';

export { Gameplay };

function Gameplay() {
  let playerOne = null;
  let playerTwo = null;
  let currentPlayer = null;
  function newPvpGame(p1name, p2name) {
    if (p1name == null) {
      p1name = 'Player One';
    }
    if (p2name == null) {
      p2name = 'Player Two';
    }
    playerOne = Player(p1name, 1);
    randomPlaceShips(playerOne);

    playerTwo = Player(p2name, 2);
    randomPlaceShips(playerTwo);

    createGameArea(swapPlayer);

    currentPlayer = playerOne;
    renderBoards();
  }

  function createPveLobby(p1name, p2name) {
    if (p1name === null) {
      p1name = 'Player One';
    }
    playerOne = Player(p1name, 1);

    playerTwo = Player('Computer', 2);

    createGameArea(swapPlayer);

    currentPlayer = playerOne;
    renderBoards();
  }

  function startPveGame() {
    randomPlaceShips(playerTwo);
  }

  function swapPlayer() {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
    } else if (currentPlayer === playerTwo) {
      currentPlayer = playerOne;
    }
    renderBoards();
    console.log('Swapping');
  }

  function renderBoards(isGameOver = false) {
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
    handleTurnEnd(result);
  }

  function handleTurnEnd(result) {
    const opponent = currentPlayer === playerOne ? playerTwo : playerOne;
    if (result.result == 'invalid') {
      console.log('Invalid Attack');
      return;
    }
    if (result.gameOver == true) {
      console.log('game-over');

      createGameOverModal(currentPlayer, opponent);
      return;
    } else {
      createTurnOverModal(currentPlayer, result, opponent, swapPlayer);
      return;
    }
  }

  return { newPvpGame, swapPlayer, attack, handleTurnEnd };
}

function randomPlaceShips(player) {
  const board = player.board;

  const carrier = Ship(1, 'Carrier');
  const battleship = Ship(1, 'Battleship');
  const submarine = Ship(2, 'Submarine');
  const cruiser = Ship(1, 'Cruiser');
  const destroyer = Ship(1, 'Destroyer');
  const directions = ['x', 'y'];

  const shipsArray = [];
  shipsArray.push(carrier, battleship, submarine, cruiser, destroyer);

  const maxRetries = 100;

  // for (const ship of shipsArray) {
  //   let placed = false;
  //   let attempts = 0;
  //   while (!placed && attempts < maxRetries) {
  //     attempts++;
  //     let randomDirection =
  //       directions[Math.floor(Math.random() * directions.length)];

  //     const length = ship.getLength();

  //     let randomX;
  //     let randomY;
  //     if (randomDirection === 'x') {
  //       randomX = Math.floor(Math.random() * (10 - length + 1));
  //       randomY = Math.floor(Math.random() * 10);
  //     } else {
  //       randomY = Math.floor(Math.random() * (10 - length + 1));
  //       randomX = Math.floor(Math.random() * 10);
  //     }

  //     placed = board.placeShip(ship, randomX, randomY, randomDirection);
  //   }
  // }

  board.placeShip(submarine, 0, 0, 'x');
  board.placeShip(destroyer, 9, 9, 'y');
}
