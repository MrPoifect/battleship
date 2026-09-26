import { Player } from './player.js';
import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { renderGameBoard, renderTargetBoard } from './dom.js';

export { Gameplay };

function Gameplay() {
  let playerOne = null;
  let playerTwo = null;
  function newGame() {
    playerOne = Player('TestP1');
    placeTempShips(playerOne);

    playerTwo = Player('TestP2');
    placeTempShips2(playerTwo);
    renderBoards();
  }

  function renderBoards() {
    renderGameBoard(playerOne);
    renderTargetBoard(playerOne, playerTwo);

    renderGameBoard(playerTwo);
    renderTargetBoard(playerTwo, playerOne);
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

  return { newGame, renderBoards };
}
