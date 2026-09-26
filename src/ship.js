export { Ship };

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
    return hitCount;
  };

  return { hit, isSunk, getLength: () => shipLength, getHitCount };
}
