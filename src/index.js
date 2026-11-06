import './styles.css';

import { Gameplay } from './modules/gameplay.js';

import { createMainMenu, createPlayerInputs } from './modules/dom.js';

export { startPvpGame };

function startPvpGame(p1name, p2name) {
  const game = Gameplay();
  game.newPvpGame(p1name, p2name);
}

function startPveGame(p1name) {
  const game = Gameplay();
  game.newPveGame();
}

createMainMenu();

// startPvpGame("Joe", "Charlotte");
