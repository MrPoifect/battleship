export { Gameboard };
import { markCell } from './dom.js';

function Gameboard() {
  const board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  const placedShips = [];

  const placeShip = (ship, x, y, direction) => {
    const length = ship.getLength();
    if (direction === 'x') {
      const newY = y;
      for (let i = 0; i < length; i++) {
        let newX = x + i;
        if (board[newY][newX] == null) {
          board[newY][newX] = ship;
        } else {
          return "Can't Place Ship";
        }
        placedShips.push(ship);
      }
    }
    if (direction === 'y') {
      const newX = x;
      for (let i = 0; i < length; i++) {
        let newY = y + i;
        if (board[newY][newX] == null) {
          board[newY][newX] = ship;
        } else {
          return "Can't Place Ship";
        }
        placedShips.push(ship);
      }
    }
  };

  const recieveAttack = (x, y, cell) => {
    const target = board[y][x];
    if (target === 'miss' || target === 'hit') {
      console.log("Can't place");
      return;
    }

    if (target != null) {
      target.hit();
      board[y][x] = 'hit';
      markCell(cell, 'hit');
    } else {
      board[y][x] = 'miss';
      markCell(cell, 'miss');
      return;
    }
  };

  const checkGameOver = () => {
    let deadShipCount = 0;
    for (const ship of placedShips) {
      if (!ship.isSunk()) {
        return false;
      } else {
        deadShipCount++;
        if (deadShipCount === placedShips.length) {
          return true;
        }
      }
    }
  };

  return { placeShip, board, recieveAttack, checkGameOver };
}
