export { Gameboard };

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
        return "Can't Place Ship";
      }
    }

    for (let i = 0; i < length; i++) {
      const newX = direction === 'x' ? x + i : x;
      const newY = direction === 'y' ? y + i : y;

      board[newY][newX] = ship;
    }

    placedShips.push(ship);
  };

  const recieveAttack = (x, y) => {
    const target = board[y][x];
    if (target === 'miss' || target === 'hit') {
      console.log("Can't place");
      return;
    }

    if (target != null) {
      target.hit();
      board[y][x] = 'hit';

      return 'hit';
    } else {
      board[y][x] = 'miss';
      return 'miss';
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
