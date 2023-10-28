import { Game } from "./class/game";
import { HtmlRenderer } from "./renderers/html-renderer";



document.addEventListener("DOMContentLoaded", () => {
	// Create our game and renderer
	let renderer: HtmlRenderer = new HtmlRenderer();
	let game: Game = new Game();

	// Set up the renderer to listen for game events
	renderer.bindToGame(game);

	// Initialize the game
	game.initialize();

	//game.emulatePlay();
});