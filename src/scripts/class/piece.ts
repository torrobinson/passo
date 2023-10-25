import { Game } from "./game";
import { PlayerType } from "../enum/player-type";
import { Point } from "./point";

export class Piece {
	game: Game;
	owner: PlayerType;
	position: Point;

	constructor(game: Game, owner: PlayerType, position: Point) {
		this.game = game;
		this.owner = owner;
		this.position = position;
	}
}