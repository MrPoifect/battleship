export { Gameboard };

import { createTurnOverModal } from './dom.js';

import { Gameplay } from './gameplay.js';

function Gameboard() {
  const board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  const placedShips = [];

  const placeShip = (ship, x, y, direction) => {
    const length = ship.getLength();
    for (let i = 0; i < length; i++) {
      const newX = direction === 'x' ? x + i : x;
      const newY = direction === 'y' ? y + i : y;

      if (
        newX < 0 ||
        newX >= 10 ||
        newY < 0 ||
        newY >= 10 ||
        board[newY][newX] != null
      ) {
        console.log('invalid placement');
        return false;
      }
    }

    for (let i = 0; i < length; i++) {
      const newX = direction === 'x' ? x + i : x;
      const newY = direction === 'y' ? y + i : y;

      board[newY][newX] = ship;
    }

    placedShips.push(ship);
    return true;
  };

  const receiveAttack = (x, y) => {
    const target = board[y][x];
    if (target === 'miss' || target === 'hit') {
      return {
        result: 'invalid',
        sunk: false,
        shipLength: null,
        coordinates: { x, y },
        gameOver: false
      };
    }

    if (target != null) {
      target.hit();

      const targetSunk = target.isSunk();
      const targetLength = target.getLength();

      board[y][x] = 'hit';

      const gameOver = checkGameOver();
      return {
        result: 'hit',
        sunk: targetSunk,
        shipLength: targetLength,
        coordinates: { x, y },
        gameOver: gameOver
      };
    } else {
      board[y][x] = 'miss';
      const gameOver = checkGameOver();
      return {
        result: 'miss',
        sunk: false,
        shipLength: null,
        coordinates: { x, y },
        gameOver: false
      };
    }
  };

  const checkGameOver = () => {
    let deadShipCount = 0;
    for (const ship of placedShips) {
      if (!ship.isSunk()) {
        return false;
      } else {
        deadShipCount++;
        if (deadShipCount >= placedShips.length) {
          return true;
        }
      }
    }
  };


  return { placeShip, board, receiveAttack, checkGameOver,};
}
