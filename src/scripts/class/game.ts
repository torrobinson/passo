import { PlayerType } from "../enum/player-type";
import { Piece } from "./piece";
import { Point } from "./point";
import { Tile } from "./tile";
import { EventEmitter } from "./../events/event-emitter";
import { MoveablePiece } from "./movable-piece";
import { Rules } from "./rules";
import { WinCondition } from "../enum/win-condition";
import { GameWonEventArgs } from "../events/game-won-event-args";
import { Move } from "./move";

export class Game {

	// Rules and constraints
	public rules: Rules = new Rules();

	// State
	public pieces: Piece[] = [];
	public tiles: Tile[] = [];
	public turnPlayer: PlayerType = PlayerType.Red;
	public isOver: boolean = false;

	// Dimensions
	public height: number = 5;
	public width: number = 5;

	// Events
	public onGameStart: EventEmitter<Game> = new EventEmitter<Game>();
	public onPieceCreated: EventEmitter<Piece> = new EventEmitter<Piece>();
	public onPieceMoved: EventEmitter<Piece> = new EventEmitter<Piece>();
	public onTileCreated: EventEmitter<Tile> = new EventEmitter<Tile>();
	public onTileRemovedFromPlay: EventEmitter<Tile> = new EventEmitter<Tile>();
	public onPlayerTurnStart: EventEmitter<PlayerType> = new EventEmitter<PlayerType>();
	public onPlayerTurnEnd: EventEmitter<PlayerType> = new EventEmitter<PlayerType>();
	public onPieceRemovedFromPlay: EventEmitter<Piece> = new EventEmitter<Piece>();
	public onGameWon: EventEmitter<GameWonEventArgs> = new EventEmitter<GameWonEventArgs>();


	public initialize(): void {
		this.isOver = false;

		// Emit that a new game has started
		this.onGameStart.emit(this);

		// Setup tiles
		this.resetTiles();

		// Setup pieces on back rows
		this.resetPieces();

		// Set turn
		// Black starts
		this.endTurn(PlayerType.Red);
	}

	public endTurn(forPlayer: PlayerType): void {

		let oldPlayer: PlayerType = forPlayer;
		let newPlayer: PlayerType = (forPlayer == PlayerType.Black ? PlayerType.Red : PlayerType.Black);

		// Set the new player
		this.turnPlayer = newPlayer;

		// Emit that current players turn ended
		this.onPlayerTurnEnd.emit(oldPlayer);

		// Emit that new players turn started
		this.onPlayerTurnStart.emit(newPlayer);
	}

	public winGameByPlayer(winningPlayer: PlayerType, winCondition: WinCondition): void {
		this.isOver = true;
		this.onGameWon.emit(new GameWonEventArgs(winningPlayer, winCondition));
	}


	private get movablePieces(): MoveablePiece[] {
		let possibleMoves: MoveablePiece[] = [];

		// For each piece
		for (let piece of this.pieces.filter(p => p.inPlay)) {
			// Get its valid moves
			let validMoves: Move[] = piece.validMoves;

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

	public getMovablePiecesForCurrentPlayer(): MoveablePiece[] {
		// Get the current player
		let currentPlayer: PlayerType = this.turnPlayer;

		let movablePieces: MoveablePiece[] = this.movablePieces;

		movablePieces = movablePieces.filter(p => p.piece.owner == currentPlayer);

		return movablePieces;
	}

	public getMovablePiecesForOtherPlayer(): MoveablePiece[] {
		// Get the current player
		let otherPlayer: PlayerType = this.turnPlayer == PlayerType.Black ? PlayerType.Red : PlayerType.Black;

		let movablePieces: MoveablePiece[] = this.movablePieces;

		movablePieces = movablePieces.filter(p => p.piece.owner == otherPlayer);

		return movablePieces;
	}

	public getMovablePiecesForAnyPlayer(): MoveablePiece[] {
		return this.movablePieces;
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

	public getIslands(): Tile[][] {
		const islands: Tile[][] = [];
		const visited: Set<Tile> = new Set();

		const dfs = (tile: Tile, island: Tile[]) => {
			if (visited.has(tile)) return;

			visited.add(tile);
			island.push(tile);

			for (const adjacentTile of tile.adjacentTiles) {
				dfs(adjacentTile, island);
			}
		};

		for (const tile of this.tiles) {
			if (!visited.has(tile)) {
				const newIsland: Tile[] = [];
				dfs(tile, newIsland);
				islands.push(newIsland);
			}
		}

		return islands;
	}

	// Piece helpers
	private createPiece(piece: Piece): void {
		this.pieces.push(piece);
		this.onPieceCreated.emit(piece);
	}

}