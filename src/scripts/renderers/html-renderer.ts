import { Game } from "../class/game";
import { Piece } from "../class/piece";
import { Tile } from "../class/tile";

export class HtmlRenderer {
	game: Game;

	public bindToGame(game: Game): void {
		this.game = game;

		// When a tile is created
		this.game.onTileCreated.on((tile: Tile) => {
			console.log(`Tile created @ ` + tile.position);
		});

		// When a piece is created
		this.game.onPieceCreated.on((piece: Piece) => {
			console.log(`Piece created @ ` + piece.position);
		});

	}
}