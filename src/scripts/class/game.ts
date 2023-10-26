import { PlayerType } from "../enum/player-type";
import { Piece } from "./piece";
import { Point } from "./point";
import { Tile } from "./tile";
import { EventEmitter } from "./../events/event-emitter";
import { MoveablePiece } from "./movable-piece";
import { Rules } from "./rules";
import { OnPlayerTurnStartEventArgs } from "../events/on-player-turn-start-event-args";

export class Game {

	// Rules and constraints
	public rules: Rules = new Rules();

	// State
	public pieces: Piece[] = [];
	public tiles: Tile[] = [];
	public turnPlayer: PlayerType = PlayerType.Red;

	// Dimensions
	private height: number = 5;
	private width: number = 5;

	// Events
	public onGameStart: EventEmitter<Game> = new EventEmitter<Game>();
	public onPieceCreated: EventEmitter<Piece> = new EventEmitter<Piece>();
	public onPieceMoved: EventEmitter<Piece> = new EventEmitter<Piece>();
	public onTileCreated: EventEmitter<Tile> = new EventEmitter<Tile>();
	public onTileRemovedFromPlay: EventEmitter<Tile> = new EventEmitter<Tile>();
	public onPlayerTurnStart: EventEmitter<OnPlayerTurnStartEventArgs> = new EventEmitter<OnPlayerTurnStartEventArgs>();
	public onPlayerTurnEnd: EventEmitter<PlayerType> = new EventEmitter<PlayerType>();


	public initialize(): void {
		// Emit that a new game has started
		this.onGameStart.emit(this);

		// Setup tiles
		this.resetTiles();

		// Setup pieces on back rows
		this.resetPieces();
	}

	public endTurn(forPlayer: PlayerType): void {

		let oldPlayer: PlayerType = forPlayer;
		let newPlayer: PlayerType = (forPlayer == PlayerType.Black ? PlayerType.Red : PlayerType.Black);

		// Set the new player
		this.turnPlayer = newPlayer;

		// Emit that current players turn ended
		this.onPlayerTurnEnd.emit(oldPlayer);

		// Emit that new players turn started
		this.onPlayerTurnStart.emit(new OnPlayerTurnStartEventArgs(newPlayer, this.movablePieces));
	}

	public get movablePieces(): MoveablePiece[] {
		let possibleMoves: MoveablePiece[] = [];

		// Get the current player
		let currentPlayer: PlayerType = this.turnPlayer;

		// Get their current active pieces
		let pieces: Piece[] = this.pieces.filter(p => p.owner == currentPlayer);

		// For each of the current player's pieces
		for (let piece of pieces) {
			// Get its valid moves
			let validMoves: Point[] = piece.validMoves;

			// And create a movable piece if it has any
			if (validMoves.length > 0) {
				possibleMoves.push(
					new MoveablePiece(
						piece,
						validMoves
					)
				);
			}
		}

		return possibleMoves;
	}


	sleep = async (milliseconds: number): Promise<void> => {
		return new Promise(resolve => setTimeout(resolve, milliseconds));
	};
	public async emulatePlay(): Promise<void> {
		let dur: number = 500;

		// Black
		let blackPiece: Piece = this.pieces.filter(p => p.id == 'black|1')[0];
		blackPiece.move(new Point(0, 1));
		await this.sleep(dur);

		// Red
		let redPiece: Piece = this.pieces.filter(p => p.id == 'red|1')[0];
		redPiece.move(new Point(1, 3));
		await this.sleep(dur);

		// Black
		blackPiece.move(new Point(0, 2));
		await this.sleep(dur);

		// Red stacks
		redPiece.move(new Point(2, 4));
		await this.sleep(dur);

		// Black goes on top
		blackPiece.move(new Point(1, 2));
		await this.sleep(dur);
		blackPiece.move(new Point(2, 3));
		await this.sleep(dur);
		blackPiece.move(new Point(2, 4));
		await this.sleep(dur);

		blackPiece.move(new Point(3, 3));
		await this.sleep(dur);
	}

	// Reset state of all tiles
	private resetTiles(): void {
		this.tiles = [];

		for (let x: number = 0; x < this.width; x++) {
			for (let y: number = 0; y < this.height; y++) {
				let newTile = new Tile(this, new Point(x, y));
				this.createTile(newTile);
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
				x + 1, // x pos as ID
				PlayerType.Black,
				new Point(x, 0)
			);
			this.createPiece(newBlack);

			// Red on bottom
			let newRed: Piece = new Piece(
				this,
				x + 1, // x pos as ID
				PlayerType.Red,
				new Point(x, this.height - 1)
			);
			this.createPiece(newRed);
		}
	}

	// Tile helpers
	private createTile(tile: Tile): void {
		this.tiles.push(tile);
		this.onTileCreated.emit(tile);
	}

	// Piece helpers
	private createPiece(piece: Piece): void {
		this.pieces.push(piece);
		this.onPieceCreated.emit(piece);
	}

}