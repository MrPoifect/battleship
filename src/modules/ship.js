export { Ship };

function Ship(length, name) {
  const shipLength = length;
  const shipName = name;
  let hitCount = 0;

  const hit = () => {
    hitCount += 1;
    return hitCount;
  };

  const isSunk = () => {
    return hitCount >= shipLength;
  };

  const getHitCount = () => {
    return hitCount;
  };

  const getLength = () => {
    return shipLength;
  };

  return { hit, isSunk, getLength, getHitCount, shipName };
}
