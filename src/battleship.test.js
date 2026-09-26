import { Ship } from './modules/ship.js';
import { Gameboard } from './modules/gameboard.js';
import { Player } from './modules/player.js';

test('Ship Hit Test', () => {
  const ship = Ship(4);
  expect(ship.hit()).toBe(1);
  expect(ship.hit()).toBe(2);
});

test('Shink sink Test', () => {
  const ship = Ship(4);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test('Board place x Test', () => {
  const ship = Ship(4);
  const board = Gameboard();

  board.placeShip(ship, 0, 0, 'x');

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (y === 0 && x >= 0 && x <= 3) {
        expect(board.board[y][x]).toBe(ship);
      } else {
        expect(board.board[y][x]).toBe(null);
      }
    }
  }
});

test('Board place y Test', () => {
  const ship = Ship(4);
  const board = Gameboard();

  board.placeShip(ship, 0, 0, 'y');

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (x === 0 && y >= 0 && y <= 3) {
        expect(board.board[y][x]).toBe(ship);
      } else {
        expect(board.board[y][x]).toBe(null);
      }
    }
  }
});

test('attacking target test', () => {
  const ship = Ship(4);
  const board = Gameboard();

  board.placeShip(ship, 0, 0, 'x');

  expect(board.board[0][0]).toBe(ship);

  expect(ship.getHitCount()).toBe(0);
  board.recieveAttack(0, 0);
  expect(ship.getHitCount()).toBe(1);
  board.recieveAttack(0, 0);
  expect(ship.getHitCount()).toBe(1);

  board.recieveAttack(1, 0);
  expect(ship.getHitCount()).toBe(2);
  board.recieveAttack(1, 1);
  expect(ship.getHitCount()).toBe(2);

  board.recieveAttack(2, 0);
  board.recieveAttack(9, 9);
  expect(ship.getHitCount()).toBe(3);
  expect(ship.isSunk()).toBe(false);

  board.recieveAttack(3, 0);
  expect(ship.getHitCount()).toBe(4);
  expect(ship.isSunk()).toBe(true);
});

test('Game over test', () => {
  const shipA = Ship(4);
  const shipB = Ship(2);
  const board = Gameboard();

  board.placeShip(shipA, 0, 0, 'x');
  board.placeShip(shipB, 0, 1, 'x');

  expect(board.checkGameOver()).toBe(false);

  board.recieveAttack(0, 0);
  board.recieveAttack(1, 0);
  board.recieveAttack(2, 0);
  board.recieveAttack(3, 0);

  expect(board.checkGameOver()).toBe(false);

  board.recieveAttack(0, 1);
  board.recieveAttack(1, 1);

  expect(board.checkGameOver()).toBe(true);
});

test("Place in taken spot", () => {
  const ShipA = Ship(4);
  const ShipB = Ship(4);
  const board= Gameboard();

  board.placeShip(ShipA, 0,0, "x");

  expect(board.placeShip(ShipB, 0,0, "y")).toBe("Can't Place Ship")

})
