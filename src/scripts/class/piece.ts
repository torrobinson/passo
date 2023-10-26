import { Game } from "./game";
import { PlayerType } from "../enum/player-type";
import { Point } from "./point";
import { Tile } from "./tile";

export class Piece {
	id: string;
	active: boolean;
	game: Game;
	owner: PlayerType;
	position: Point;
	height: number;

	constructor(game: Game, index: number, owner: PlayerType, position: Point) {
		this.game = game;
		this.id = `${owner}|${index}`;
		this.active = true;
		this.owner = owner;
		this.position = position;
		this.height = 1;
	}

	public get currentTile(): Tile {
		return this.game.tiles.filter(t => t.position.x == this.position.x && t.position.y == this.position.y)[0];
	}

	public get validMoves(): Point[] {
		let currentTile: Tile = this.currentTile;

		// If there are any other pieces on this tile higher than it, it's stuck and can't move
		if (currentTile.pieces.some(p => p.height > this.height)) {
			return [];
		}

		// Otherwise, look for adjacent tiles that still exist
		let potentialTiles: Tile[] = currentTile.adjacentTiles;

		// Filter out any that have too many pieces
		let validTiles: Tile[] = potentialTiles.filter(t =>
			t.pieces.length < this.game.rules.maxStackSize
		);

		return validTiles.map(t => t.position);
	}

	public move(newPosition: Point): void {
		let sourceTile: Tile = this.currentTile;
		let destinationTile: Tile = this.game.tiles.filter(t => t.position.x == newPosition.x && t.position.y == newPosition.y)[0];


		// If the intended movement is included in our valid moves, we can move there
		let canMove: boolean = this.validMoves.some(vm =>
			vm.x == newPosition.x &&
			vm.y == newPosition.y
		);

		if (canMove) {
			// Set height
			this.height = destinationTile.pieces.length + 1;

			// Set the new position
			this.position = newPosition;

			// Have tile check if it's empty now, and if so, remove it

			if (sourceTile.isEmpty) {
				sourceTile.removeFromPlay();
			}

			// TODO: check for unique contiguous (inc. diag) islands
			// For each island
			// If there's no pieces on the island, remove all tiles in it from play
			// If there are pieces, check if any can make a move
			// If it can, fine
			// If NONE can, then remove the tiles AND pieces from play 

			// Emit event
			this.game.onPieceMoved.emit(this);

			// End turn
			this.game.endTurn(this.owner);
		}
	}
}