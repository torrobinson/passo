import { PlayerType } from "../enum/player-type";
import { Piece } from "./piece";
import { Point } from "./point";
import { Tile } from "./tile";

export class Game {

	// Actors
	public pieces: Piece[] = [];
	public tiles: Tile[] = [];

	// Dimensions
	private height: number = 5;
	private width: number = 5;

	constructor() {
		this.initialize();
	}

	public initialize(): void {
		// Reset everything

		// Setup tiles
		this.resetTiles();

		// Setup pieces on back rows
		this.resetPieces();
	}

	// Reset state of all tiles
	private resetTiles(): void {
		this.tiles = [];

		for (let x: number = 0; x < this.width; x++) {
			for (let y: number = 0; y < this.height; y++) {
				let newTile = new Tile(this, new Point(x, y));
				this.tiles.push(newTile);
			}
		}
	}

	// Resets all piece positions
	private resetPieces(): void {
		this.pieces = [];

		// Black at the top
		for (let tile of this.tiles.filter(t => t.y === 0)) {
			this.pieces.push(
				new Piece(
					this,
					PlayerType.Black,
					tile.position
				)
			);
		}

		// Red at the bottom
		for (let tile of this.tiles.filter(t => t.y === this.height - 1)) {
			this.pieces.push(
				new Piece(
					this,
					PlayerType.Red,
					tile.position
				)
			);
		}
	}

}