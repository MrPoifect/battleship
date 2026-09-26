import "./styles.css"

import { Gameplay } from "./modules/gameplay.js"

function startGame() {
    const game = Gameplay();
    game.newGame();
}

startGame();