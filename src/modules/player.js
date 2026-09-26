export { Player };
import { Gameboard } from './gameboard.js';

function Player(playerName) {
  const name = playerName
  const board = Gameboard();

  return {name, board}
}