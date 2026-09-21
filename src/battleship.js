export { Ship, Gameboard };

function Ship(length) {
  const shipLength = length;
  let hitCount = 0;

  const hit = () => {
    hitCount += 1;
    return hitCount;
  };

  const isSunk = () => {
    return hitCount >= shipLength;
  };

  return { hit, isSunk, getLength: () => shipLength };
}

function Gameboard() {
  const board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

    const placeShip = (ship, x, y, direction) => {
        const length = ship.getLength();
        if (direction = "horizontal"){
            const newY = y;
            for (let i = 0; i < length; i++){
                const newX = x + i;
                board[newY][newX] = ship
            }
        }
        if (direction = "vertical") {
            const newX = x;
            for (let i = 0; i < length; i++){
                const newY = y + i;
                board[newY][newX] = ship
            }
        }
    }

    return {placeShip,}
}
