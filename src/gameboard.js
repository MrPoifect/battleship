export { Gameboard };

function Gameboard() {
  const board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  const placedShips = [];
  const missedCells = [];

  const placeShip = (ship, x, y, direction) => {
    const length = ship.getLength();
    if (direction === 'x') {
      const newY = y;
      for (let i = 0; i < length; i++) {
        let newX = x + i;
        if (board[newY][newX] == null) {
          board[newY][newX] = ship;
          placedShips.push(ship);
        } else {
            return "Can't Place Ship";
        }
      }
    }
    if (direction === 'y') {
      const newX = x;
      for (let i = 0; i < length; i++) {
        let newY = y + i;
        if (board[newY][newX] == null) {
          board[newY][newX] = ship;
          placedShips.push(ship);
        } else {
          return "Can't Place Ship";
        }
      }
    }
  };

  const recieveAttack = (x, y) => {
    const target = board[y][x];
    if (target === 'miss' || target === 'hit') {
      return;
    }

    if (target != null) {
      target.hit();
      board[y][x] = 'hit';
    } else {
      board[y][x] = 'miss';
      return (x, y);
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
