import { Game } from "./game";
import { PlayerType } from "../enum/player-type";
import { Point } from "./point";
import { Tile } from "./tile";

export class Piece {
	id: number;
	game: Game;
	owner: PlayerType;
	position: Point;
	height: number;

	constructor(game: Game, id: number, owner: PlayerType, position: Point) {
		this.game = game;
		this.id = id;
		this.owner = owner;
		this.position = position;
		this.height = 1;
	}

	public move(newPosition: Point): void {
		let sourceTile: Tile = this.game.tiles.filter(t => t.position.x == this.position.x && t.position.y == this.position.y)[0];
		let destinationTile: Tile = this.game.tiles.filter(t => t.position.x == newPosition.x && t.position.y == newPosition.y)[0];

		let isInRange: boolean = Math.abs(destinationTile.position.x - sourceTile.position.x) <= 1
			&& Math.abs(destinationTile.position.y - sourceTile.position.y) <= 1;

		let canMove: boolean = destinationTile.inPlay && isInRange && destinationTile.pieces.length < 3;

		if (canMove) {
			// Set height
			this.height = destinationTile.pieces.length + 1;

			// Set the new position
			this.position = newPosition;

			// Have tile check if it's empty now, and if so, remove it

			if (sourceTile.isEmpty) {
				sourceTile.removeFromPlay();
			}

			// Emit event
			this.game.onPieceMoved.emit(this);

			// End turn
			this.game.endTurn();
		}
	}
}