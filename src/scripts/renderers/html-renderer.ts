import { Game } from "../class/game";
import { Piece } from "../class/piece";
import { Tile } from "../class/tile";
import { PlayerType } from "../enum/player-type";
import { HtmlUtilities } from "../utility/html-utilities";

export class HtmlRenderer {
	game: Game;

	tilesHolder: HTMLElement;
	piecesHolder: HTMLElement;

	turnHint: HTMLElement;

	constructor() {
		this.game = new Game();

		this.tilesHolder = document.querySelector('.board .tiles')!;
		this.piecesHolder = document.querySelector('.board .pieces')!;

		this.turnHint = document.querySelector('.turn-hint')!;
	}

	public bindToGame(game: Game): void {
		this.game = game;

		// When a tile is created
		this.game.onTileCreated.on((tile: Tile) => {
			let newTile: HTMLElement = HtmlUtilities.elementFromString(`
				<tile data-x="${tile.position.x}" data-y="${tile.position.y}" data-in-play="${tile.inPlay}">
				</tile>
			`);

			this.tilesHolder.appendChild(newTile);
		});

		// When a tile is removed from play
		this.game.onTileRemovedFromPlay.on((tile: Tile) => {
			this.updateTileElement(tile);
		});

		// When a piece is created
		this.game.onPieceCreated.on((piece: Piece) => {
			let newPiece: HTMLElement = HtmlUtilities.elementFromString(`
				<piece data-id="${piece.id}" data-x="${piece.position.x}" data-y="${piece.position.y}" data-owner="${piece.owner}" data-height="${piece.height}">
				</piece>
			`);

			this.piecesHolder.appendChild(newPiece);
		});

		// When a piece moves
		this.game.onPieceMoved.on((piece: Piece) => {
			// Update it
			this.updatePieceElement(piece);

			// Set as last active so we can keep it on-top of other pieces, visually
			this.setPieceAsLastActive(piece);
		});

		// When a turn starts
		this.game.onPlayerTurnStart.on((player: PlayerType) => {
			this.turnHint.classList.remove('red');
			this.turnHint.classList.remove('black');
			this.turnHint.classList.add(player);
		});
	}

	private getPieceElement(piece: Piece): HTMLElement | null {
		let foundElement: HTMLElement | null = this.piecesHolder.querySelector(`piece[data-id="${piece.id}"][data-owner="${piece.owner}"]`);
		return foundElement;
	}

	private getTileElement(tile: Tile): HTMLElement | null {
		let foundElement: HTMLElement | null = this.tilesHolder.querySelector(`tile[data-x="${tile.position.x}"][data-y="${tile.position.y}"]`);
		return foundElement;
	}

	private updatePieceElement(piece: Piece) {
		// Find the piece
		let pieceElement = this.getPieceElement(piece);
		if (pieceElement == null) return;

		// Update it
		pieceElement.setAttribute('data-x', piece.position.x.toString());
		pieceElement.setAttribute('data-y', piece.position.y.toString());
		pieceElement.setAttribute('data-height', piece.height.toString());
	}

	private updateTileElement(tile: Tile) {
		// Find the tile
		let tileElement = this.getTileElement(tile);
		if (tileElement == null) return;

		// Update it
		tileElement.setAttribute('data-in-play', tile.inPlay.toString());
	}

	private setPieceAsLastActive(piece: Piece) {
		let pieceElement: HTMLElement = this.getPieceElement(piece)!;
		let lastActiveClass: string = 'last-active-piece';

		// Remove from all elements
		this.piecesHolder.querySelectorAll('piece').forEach(p => {
			p.classList.remove(lastActiveClass);
		});

		// Add to this one
		pieceElement.classList.add(lastActiveClass);

	}
}