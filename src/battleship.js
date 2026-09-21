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

  const getHitCount = () => {
    return hitCount
  }

  return { hit, isSunk, getLength: () => shipLength, getHitCount };
}

function Gameboard() {
  const board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

    const placeShip = (ship, x, y, direction) => {
        const length = ship.getLength();
        if (direction === "horizontal"){
            const newY = y;
            for (let i = 0; i < length; i++){
                let newX = x + i;
                board[newY][newX] = ship
            }
        }
        if (direction === "vertical") {
            const newX = x;
            for (let i = 0; i < length; i++){
                let newY = y + i;
                board[newY][newX] = ship
            }
        }
    }

    const recieveAttack = (x, y) => {
        const target = board[y][x];
        if (target === "miss" || target === "hit"){
            return;
        }

        if (target != null){
            target.hit();
            board[y][x] = "hit"

        } else {
            board[y][x] = "miss";
            return (x,y);
        }
    }

    return {placeShip, board, recieveAttack}
}
