import { Player } from './player.js';
import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';
import { renderGameBoard } from './dom.js';

export { Gameplay };

function Gameplay() {
  let playerOne = null;
  let playerTwo = null;
  function newGame() {
    playerOne = Player('TestP1');
    renderGameBoard(playerOne);
    console.log("Player1")
    playerTwo = Player('TestP2');
  };

  return {newGame};
}
