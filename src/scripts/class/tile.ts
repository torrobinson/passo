import { Game } from "./game";
import { Piece } from "./piece";
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

	public get pieces(): Piece[] {
		return this.game.pieces.filter(p => p.position.x == this.position.x && p.position.y == this.position.y);
	}

	public get isEmpty(): boolean {
		return this.pieces.length == 0;
	}

	// Gets adjacent in-play tiles
	public get adjacentTiles(): Tile[] {
		// Get all possible 8 directions
		let adjacentPointsAsStrings: string[] = this.position.adjacentPoints.map(p => p.toString());

		// Get game tiles that are in play that match those locations
		let adjacentTiles = this.game.tiles.filter(t =>
			t.inPlay
			&& adjacentPointsAsStrings.includes(t.position.toString())
		);

		return adjacentTiles;
	}

	public removeFromPlay(): void {
		this.inPlay = false;
		this.game.onTileRemovedFromPlay.emit(this);
	}
}