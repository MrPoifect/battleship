import { Ship, Gameboard } from './battleship';

test('Ship Hit Test', () => {
  const shipA = Ship(4);
  expect(shipA.hit()).toBe(1);
  expect(shipA.hit()).toBe(2);
});

test('Shink sink Test', () => {
  const shipB = Ship(4);
  shipB.hit();
  shipB.hit();
  shipB.hit();
  expect(shipB.isSunk()).toBe(false);
  shipB.hit();
  expect(shipB.isSunk()).toBe(true);
});


test("Board place horizontal Test", () => {
    const shipC = Ship(4);
    const boardA = Gameboard();

    boardA.placeShip(shipC, 0,0, "horizontal");
    expect(boardA.board[0][0]).toBe(shipC);
})