import { Game } from "./class/game";
import { HtmlRenderer } from "./renderers/html-renderer";

let renderer: HtmlRenderer = new HtmlRenderer();
let game: Game = new Game();


document.addEventListener("DOMContentLoaded", () => {
	renderer.bindToGame(game);
	game.initialize();

});