import { Game } from "../class/game";
import { MoveablePiece } from "../class/movable-piece";
import { Piece } from "../class/piece";
import { Point } from "../class/point";
import { Tile } from "../class/tile";
import { PlayerType } from "../enum/player-type";
import { HtmlUtilities } from "../utility/html-utilities";

export class HtmlRenderer {
	game: Game;

	tilesHolder: HTMLElement;
	piecesHolder: HTMLElement;
	movesHolder: HTMLElement;

	turnHint: HTMLElement;

	constructor() {
		this.game = new Game();

		this.tilesHolder = document.querySelector('.board .tiles')!;
		this.piecesHolder = document.querySelector('.board .pieces')!;
		this.movesHolder = document.querySelector('.board .moves')!;

		this.turnHint = document.querySelector('.turn-hint')!;

		// Bind to piece clicks
		HtmlUtilities.liveBind('click', 'piece', (el, e) => {
			let clickedPiece: Piece = this.game.pieces.filter(p => p.id == el.getAttribute('data-id'))![0];
			this.handlePieceClicked(clickedPiece);
		});

		// Bind to move clicks
		HtmlUtilities.liveBind('click', 'move', (el, e) => {
			// Parse the clicked location from  the move overlay
			let clickedPoint: Point = new Point(
				parseInt(el.getAttribute('data-x')!),
				parseInt(el.getAttribute('data-y')!)
			);

			// And if we have a valid piece selected
			if (this.selectedPiece != null) {
				// Hide the overlay
				this.hidePossibleMoves();

				// Make the move
				this.movePiece(this.selectedPiece, clickedPoint);
			}
		});
	}

	public bindToGame(game: Game): void {
		this.game = game;

		// When a new game starts
		this.game.onGameStart.on((newGame: Game) => {
			// Reset anything we need to

			// Clear any existing elements
			[this.tilesHolder, this.piecesHolder, this.movesHolder].forEach(el => el.innerHTML = '');
		});

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

		// When a piece if removed from play
		this.game.onPieceRemovedFromPlay.on((piece: Piece) => {
			this.updatePieceElement(piece);
		});

		// When a piece is created
		this.game.onPieceCreated.on((piece: Piece) => {
			let newPiece: HTMLElement = HtmlUtilities.elementFromString(`
				<piece 
					data-id="${piece.id}" 
					data-x="${piece.position.x}" 
					data-y="${piece.position.y}" 
					data-owner="${piece.owner}" 
					data-height="${piece.height}"
					data-can-move="false"	
				>
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
		this.game.onPlayerTurnStart.on((newPlayer: PlayerType) => {
			// Render the turn hint
			this.turnHint.classList.remove('red');
			this.turnHint.classList.remove('black');
			this.turnHint.classList.add(newPlayer);

			// Update local piece can-move states
			// Set all as non-moveable
			for (let piece of this.game.pieces) {
				let pieceElement: HTMLElement = this.getPieceElement(piece)!;
				pieceElement.setAttribute('data-can-move', false.toString());
			}

			let allPossibleMoves: MoveablePiece[] = this.game.getMovablePiecesForAnyPlayer();
			for (let player of [PlayerType.Red, PlayerType.Black]) {
				let playerMovablePieces: MoveablePiece[] = allPossibleMoves.filter(mp => mp.piece.owner == player);
				if (playerMovablePieces.length == 0) {
					// The players turn has started but they can't make any moves == they lose
					alert(`${player} cannot make any moves. ${player} loses.`);
				}
			}

			for (let moveablePiece of allPossibleMoves.filter(mp => mp.piece.owner == this.game.turnPlayer)) {
				let moveablePieceElement: HTMLElement = this.getPieceElement(moveablePiece.piece)!;
				moveablePieceElement.setAttribute('data-can-move', true.toString());
			}

		});
	}

	private getPieceElement(piece: Piece): HTMLElement | null {
		let foundElement: HTMLElement | null = this.piecesHolder.querySelector(`piece[data-id="${piece.id}"]`);
		return foundElement;
	}

	private getTileElement(tile: Tile): HTMLElement | null {
		let foundElement: HTMLElement | null = this.tilesHolder.querySelector(`tile[data-x="${tile.position.x}"][data-y="${tile.position.y}"]`);
		return foundElement;
	}

	private updatePieceElement(piece: Piece): void {
		// Find the piece
		let pieceElement = this.getPieceElement(piece);
		if (pieceElement == null) return;

		// Update it
		pieceElement.setAttribute('data-x', piece.position.x.toString());
		pieceElement.setAttribute('data-y', piece.position.y.toString());
		pieceElement.setAttribute('data-height', piece.height.toString());
		pieceElement.setAttribute('data-in-play', piece.inPlay.toString());
	}

	private updateTileElement(tile: Tile): void {
		// Find the tile
		let tileElement = this.getTileElement(tile);
		if (tileElement == null) return;

		// Update it
		tileElement.setAttribute('data-in-play', tile.inPlay.toString());
	}

	private movePiece(piece: Piece, toPosition: Point): void {
		piece.move(toPosition);
	}

	private setPieceAsLastActive(piece: Piece): void {
		let pieceElement: HTMLElement = this.getPieceElement(piece)!;
		let lastActiveClass: string = 'last-active-piece';

		// Remove from all elements
		this.piecesHolder.querySelectorAll('piece').forEach(p => {
			p.classList.remove(lastActiveClass);
		});

		// Add to this one
		pieceElement.classList.add(lastActiveClass);
	}

	private selectedPiece: Piece | null = null;
	private handlePieceClicked(clickedPiece: Piece): void {
		// If re-clicking a piece, 
		if (this.selectedPiece == clickedPiece) {
			// Unselect it
			this.hidePossibleMoves();
			this.selectedPiece = null;
		}
		else {
			// We're not re-clicking a piece, so select it
			this.selectedPiece = clickedPiece;

			// Check if it's the pieces turn
			if (this.game.turnPlayer == clickedPiece.owner) {
				// Check if the piece can move
				if (this.game.getMovablePiecesForCurrentPlayer().map(mp => mp.piece).includes(clickedPiece)) {
					// It can move
					this.showPossibleMoves(clickedPiece);
				}
				else {
					// Its your turn but this piece can't move
				}
			}
			else {
				console.log('Its not your turn!');
			}
		}
	}

	private showPossibleMoves(forPiece: Piece): void {
		// Clear existing move overlays
		this.hidePossibleMoves();

		// Create new ones for those in movablePieces
		for (let movablePiece of this.game.getMovablePiecesForCurrentPlayer().filter(mp => mp.piece == forPiece)) {
			for (let point of movablePiece.possiblePositions) {
				this.movesHolder.appendChild(
					HtmlUtilities.elementFromString(`
						<move data-x="${point.x}" data-y="${point.y}" data-piece-id="${movablePiece.piece.id}" data-owner="${movablePiece.piece.owner}">
						</move>
					`)
				)
			}
		}
	}
	private hidePossibleMoves(): void {
		this.movesHolder.innerHTML = '';
	}
}