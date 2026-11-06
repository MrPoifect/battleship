import "./styles.css"

import { Gameplay } from "./modules/gameplay.js"

import { createMainMenu } from "./modules/dom.js";

function startPvpGame(p1name, p2name) {
    const game = Gameplay();
    game.newPvpGame(p1name, p2name);
}

function startPveGame(p1name) {
    const game = Gameplay();
    game.newPveGame();
}

//createMainMenu();

startPvpGame("Joe", "Charlotte");