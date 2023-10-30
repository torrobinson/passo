import { Game } from "./game";
import { PlayerType } from "../enum/player-type";
import { Point } from "./point";
import { Tile } from "./tile";
import { MoveablePiece } from "./movable-piece";
import { WinCondition } from "../enum/win-condition";
import { GameWonEventArgs } from "../events/game-won-event-args";
import { Move } from "./move";

export class Piece {
	id: string;
	inPlay: boolean;
	game: Game;
	owner: PlayerType;
	position: Point;
	height: number;

	constructor(game: Game, index: number, owner: PlayerType, position: Point) {
		this.game = game;
		this.id = `${owner}|${index}`;
		this.inPlay = true;
		this.owner = owner;
		this.position = position;
		this.height = 1;
	}

	public get currentTile(): Tile {
		return this.game.tiles.filter(t => t.position.x == this.position.x && t.position.y == this.position.y)[0];
	}

	public get validMoves(): Move[] {
		let currentTile: Tile = this.currentTile;

		// If there are any other pieces on this tile higher than it, it's stuck and can't move
		// currentTile might also be null if we JUST moved OOB for a win condition and it's not on a tile.
		if (currentTile == null || currentTile.pieces.some(p => p.height > this.height)) {
			return [];
		}

		// Otherwise, look for adjacent tiles that still exist
		let potentialTiles: Tile[] = currentTile.adjacentTiles;
		// Filter out any that have too many pieces
		let validTiles: Tile[] = potentialTiles.filter(t =>
			t.pieces.length < this.game.rules.maxStackSize
		);
		let validTilePositions: Move[] = validTiles.map(t => new Move(t.position, false));

		// Finally, look for win conditions and add in non-tile moves for those
		let winConditionPositions: Move[] = [];

		let minOrMax: 'min' | 'max';
		let opponent: PlayerType = this.owner == PlayerType.Red ? PlayerType.Black : PlayerType.Red;
		if (this.owner == PlayerType.Red) {
			minOrMax = 'min'; // Red needs to move below min
		}
		else if (this.owner == PlayerType.Black) {
			minOrMax = 'max'; // Black needs to move above max
		}


		// They have to move downward and go lower than min(Y)
		let opponentPieces: Piece[] = this.game.pieces.filter(p => p.inPlay && p.owner == opponent);
		let furthestRow: number =
			minOrMax! == 'min' ? Math.min(...opponentPieces.map(p => p.position.y))
				: Math.max(...opponentPieces.map(p => p.position.y))
			;
		if (this.position.y == furthestRow) {
			let winDirection: number = minOrMax! == 'min' ? -1 : 1;
			let winY: number = furthestRow + winDirection;
			// They're on the same row as the opponent's closest piece, so look for the 1 orthogonal and 2 diagonal jumps to win
			// Always-available orthogonal
			winConditionPositions.push(new Move(new Point(this.position.x, winY), true));
			// Potential diagonals
			if (this.position.x > 0) winConditionPositions.push(new Move(new Point(this.position.x - 1, winY), true));
			if (this.position.x < this.game.width - 1) winConditionPositions.push(new Move(new Point(this.position.x + 1, winY), true));
		}


		return validTilePositions.concat(winConditionPositions);
	}

	public move(newPosition: Point): void {
		let sourceTile: Tile = this.currentTile;
		let destinationTile: Tile = this.game.tiles.filter(t => t.inPlay && t.position.x == newPosition.x && t.position.y == newPosition.y)[0];


		// If the intended movement is included in our valid moves, we can move there
		let canMove: boolean = this.validMoves.some(vm =>
			vm.toPosition.x == newPosition.x &&
			vm.toPosition.y == newPosition.y
		);

		let wasGoalMove: boolean = false;
		if (canMove) {
			// Set height
			if (destinationTile == null) {
				// It's null because we moved to a win condition, no destination pieces
				wasGoalMove = true;
				this.height = 1;
			}
			else {
				this.height = destinationTile.pieces.length + 1;
			}

			// Set the new position
			this.position = newPosition;

			// Have tile check if it's empty now, and if so, remove it
			if (sourceTile.isEmpty) {
				sourceTile.removeFromPlay();
			}

			// If this wasn't a direct winning move, try trim the board
			if (!wasGoalMove) {
				// Check for orphaned islands
				let islands: Tile[][] = this.game.getIslands();
				if (islands.length > 1) {
					// We have orphaned islands

					// For each island,
					for (let island of islands) {
						// Check if it's empty
						if (!island.some(i => i.pieces.length > 0)) {
							// None of the island's pieces have points.
							for (let tile of island) {
								tile.inPlay = false;
								this.game.onTileRemovedFromPlay.emit(tile);
							}
						}
						else {
							// Check if all island pieces can't move
							let allMoveablePieces: Piece[] = this.game.getMovablePiecesForAnyPlayer().map(mp => mp.piece);
							let pieceCanMoveOnIsland: boolean = false;
							for (let tile of island) {
								for (let piece of tile.pieces) {
									if (allMoveablePieces.includes(piece)) pieceCanMoveOnIsland = true;
								}
							}
							if (!pieceCanMoveOnIsland) {
								for (let tile of island) {
									// Kill the tile
									tile.inPlay = false;
									this.game.onTileRemovedFromPlay.emit(tile);

									// Kill the piece
									for (let piece of tile.pieces) {
										piece.inPlay = false;
										this.game.onPieceRemovedFromPlay.emit(piece);
									}
								}
							}
						}
					}
				}
			}

			// Check if the oppononent will even have a move if they get a turn
			let wasOpponentNowCannotMoveMove: boolean = false;
			let opponentMoves: MoveablePiece[] = this.game.getMovablePiecesForOtherPlayer();
			if (opponentMoves.length == 0) {
				wasOpponentNowCannotMoveMove = true;
			}


			// Emit moved event
			this.game.onPieceMoved.emit(this);

			// Handle win or no win
			let winCondition: WinCondition | null = null;
			if (wasOpponentNowCannotMoveMove) winCondition = WinCondition.OpponentNoMoves;
			if (wasGoalMove) winCondition = WinCondition.GoalpostReached;

			if (winCondition != null) {
				// Emit a win
				this.game.onGameWon.emit(new GameWonEventArgs(this.game.turnPlayer, winCondition));
			}
			else {
				// Wasn't a win, so end their turn
				this.game.endTurn(this.owner);
			}
		}
	}
}