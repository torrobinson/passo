import { Game } from "./game";
import { Point } from "./point";

export class Tile {
	game: Game;
	position: Point;
	inPlay: boolean;

	constructor(game: Game, position: Point) {
		this.game = game;
		this.position = position;

		// Default to in-play
		this.inPlay = true;
	}
}