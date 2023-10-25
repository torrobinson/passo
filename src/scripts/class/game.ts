import { PlayerType } from "../enum/player-type";
import { Piece } from "./piece";
import { Point } from "./point";
import { Tile } from "./tile";
import { EventEmitter } from "./../events/event-emitter";

export class Game {

	// Actors
	public pieces: Piece[] = [];
	public tiles: Tile[] = [];

	// Dimensions
	private height: number = 5;
	private width: number = 5;

	// Events
	public onPieceCreated: EventEmitter<Piece> = new EventEmitter<Piece>();
	public onTileCreated: EventEmitter<Tile> = new EventEmitter<Tile>();

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
				this.onTileCreated.emit(newTile);
			}
		}
	}

	// Resets all piece positions
	private resetPieces(): void {
		this.pieces = [];

		for (let x: number = 0; x < this.width; x++) {

			// Black on top row
			let newBlack: Piece = new Piece(
				this,
				PlayerType.Black,
				new Point(x, 0)
			);
			this.pieces.push(newBlack);
			this.onPieceCreated.emit(newBlack);

			// Red on bottom
			let newRed: Piece = new Piece(
				this,
				PlayerType.Black,
				new Point(x, this.height - 1)
			);
			this.pieces.push(newRed);
			this.onPieceCreated.emit(newRed);
		}
	}

}