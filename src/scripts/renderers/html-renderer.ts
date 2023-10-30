import { Game } from "../class/game";
import { MoveablePiece } from "../class/movable-piece";
import { Piece } from "../class/piece";
import { Point } from "../class/point";
import { Tile } from "../class/tile";
import { PlayerType } from "../enum/player-type";
import { WinCondition } from "../enum/win-condition";
import { GameWonEventArgs } from "../events/game-won-event-args";
import { HtmlUtilities } from "../utility/html-utilities";

export class HtmlRenderer {
	game: Game;

	tilesHolder: HTMLElement;
	piecesHolder: HTMLElement;
	movesHolder: HTMLElement;

	turnHint: HTMLElement;

	winScreen: HTMLElement;

	constructor() {
		this.game = new Game();

		this.tilesHolder = document.querySelector('.board .tiles')!;
		this.piecesHolder = document.querySelector('.board .pieces')!;
		this.movesHolder = document.querySelector('.board .moves')!;

		this.turnHint = document.querySelector('.turn-hint')!;

		this.winScreen = document.querySelector('.win-screen')!;

		// Bind to piece clicks
		HtmlUtilities.liveBind('click', 'piece', (el, e) => {

			// Prevent if game is over
			if (this.game.isOver) return;

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

		// Bind to piece clicks
		HtmlUtilities.liveBind('click', '.restart-game', (el, e) => {
			this.game.initialize();
			this.hideWinScreen();
		});


		// Drag Events
		// Note: make <piece> have draggable="true" if I enable this again
		// let draggedPiece: Piece | null = null;
		// let draggedPieceOrigin: Point | null = null;
		// let wasProperDrop: boolean = false;
		// HtmlUtilities.liveBind('dragstart', 'piece', (el, e: DragEvent) => {
		// 	// Get the X and Y
		// 	let x: number = parseInt(el.getAttribute('data-x')!);
		// 	let y: number = parseInt(el.getAttribute('data-y')!);

		// 	// Resolve to a piece
		// 	let piece: Piece = this.game.pieces.filter(p => p.position.x == x && p.position.y == y)[0]!;

		// 	// Set the x/y as drag event data
		// 	draggedPiece = piece;
		// 	draggedPieceOrigin = piece.position;

		// 	// Show possible moves
		// 	this.showPossibleMoves(piece);
		// });
		// HtmlUtilities.liveBind('dragend', 'piece', (el, e: DragEvent) => {

		// 	if (draggedPiece != null) {
		// 		if (!wasProperDrop) {
		// 			// If we DIDNT already handled a proper drop event, thenthis drop was abandoned, so revert to original location
		// 			let pieceElement: HTMLElement = this.getPieceElement(draggedPiece)!;
		// 			pieceElement.setAttribute('data-x', draggedPieceOrigin!.x.toString());
		// 			pieceElement.setAttribute('data-y', draggedPieceOrigin!.y.toString());
		// 		}

		// 		draggedPiece = null;
		// 		draggedPieceOrigin = null;
		// 	}


		// 	this.hidePossibleMoves();
		// });
		// HtmlUtilities.liveBind('dragover', 'move', (el, e: DragEvent) => {
		// 	e.preventDefault();

		// 	// Hover location
		// 	let x: number = parseInt(el.getAttribute('data-x')!);
		// 	let y: number = parseInt(el.getAttribute('data-y')!);

		// 	if (draggedPiece != null) {
		// 		let pieceElement: HTMLElement = this.getPieceElement(draggedPiece)!;
		// 		pieceElement.setAttribute('data-x', x.toString());
		// 		pieceElement.setAttribute('data-y', y.toString());
		// 	}

		// 	return true;
		// });
		// HtmlUtilities.liveBind('drop', 'move', (el, e: DragEvent) => {
		// 	e.stopPropagation();
		// 	e.preventDefault();


		// 	if (draggedPiece != null) {
		// 		// Move to the point of that dropped move
		// 		let point: Point = new Point(
		// 			parseInt(el.getAttribute('data-x')!),
		// 			parseInt(el.getAttribute('data-y')!)
		// 		);
		// 		draggedPiece.move(point);
		// 	}

		// 	wasProperDrop = true;

		// 	return true;
		// });
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

			let newPlayerPossibleMoves: MoveablePiece[] = this.game.getMovablePiecesForCurrentPlayer();

			for (let moveablePiece of newPlayerPossibleMoves) {
				let moveablePieceElement: HTMLElement = this.getPieceElement(moveablePiece.piece)!;
				moveablePieceElement.setAttribute('data-can-move', true.toString());
			}

		});

		// When a game is won
		this.game.onGameWon.on((e: GameWonEventArgs) => {

			let winConditionStr: string;
			switch (e.winCondition) {
				case WinCondition.GoalpostReached:
					winConditionStr = 'by reaching the goal';
					break;
				case WinCondition.OpponentNoMoves:
					winConditionStr = 'by leaving opponent with no valid moves';
					break;
			}

			setTimeout(() => {
				// Hide in-play ui elements
				this.hidePossibleMoves();

				// Show win animations
				this.showWinScreen(
					e.winningPlayer,
					winConditionStr
				);
			}, 750);
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
			for (let move of movablePiece.possibleMoves) {
				this.movesHolder.appendChild(
					HtmlUtilities.elementFromString(`
						<move
							data-x="${move.toPosition.x}" 
							data-y="${move.toPosition.y}" 
							data-piece-id="${movablePiece.piece.id}" 
							data-owner="${movablePiece.piece.owner}"
							data-is-goalpost="${move.isGoalpostWin}">
						</move>
					`)
				)
			}
		}
	}
	private hidePossibleMoves(): void {
		this.movesHolder.innerHTML = '';
	}

	private showWinScreen(winningPlayer: PlayerType, winningReason: string): void {
		this.winScreen.style.visibility = 'visible';
		this.winScreen.style.opacity = '0.7';
		this.winScreen.innerHTML = `
			<div style="text-transform: uppercase">${winningPlayer} wins</div>
			<div style="font-size: 30px;">${winningReason}</div>
			<div class="restart-game" style="
				cursor: pointer;  
				margin-top: 10px;
 				font-weight: bold; 
				font-size: 25px;
				border: 1px solid white;
				padding: 5px 10px;
				border-radius: 7px;
			">
				Restart
			</div>
		`;
	}

	private hideWinScreen(): void {
		this.winScreen.style.visibility = 'hidden';
		this.winScreen.style.opacity = '0.0';
		this.winScreen.innerHTML = '';
	}
}