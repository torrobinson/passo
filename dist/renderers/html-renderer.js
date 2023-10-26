"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlRenderer = void 0;
const html_utilities_1 = require("../utility/html-utilities");
class HtmlRenderer {
    constructor() {
        this.tilesHolder = document.querySelector('.board .tiles');
        this.piecesHolder = document.querySelector('.board .pieces');
    }
    bindToGame(game) {
        this.game = game;
        // When a tile is created
        this.game.onTileCreated.on((tile) => {
            let newTile = html_utilities_1.HtmlUtilities.elementFromString(`
				<tile data-x="${tile.position.x}" data-y="${tile.position.y}" data-in-play="${tile.inPlay}">
				</tile>
			`);
            this.tilesHolder.appendChild(newTile);
        });
        // When a tile is removed from play
        this.game.onTileRemovedFromPlay.on((tile) => {
            this.updateTileElement(tile);
        });
        // When a piece is created
        this.game.onPieceCreated.on((piece) => {
            let newPiece = html_utilities_1.HtmlUtilities.elementFromString(`
				<piece data-id="${piece.id}" data-x="${piece.position.x}" data-y="${piece.position.y}" data-owner="${piece.owner}" data-height="${piece.height}">
				</piece>
			`);
            this.piecesHolder.appendChild(newPiece);
        });
        // When a piece moves
        this.game.onPieceMoved.on((piece) => {
            // Update it
            this.updatePieceElement(piece);
        });
    }
    getPieceElement(piece) {
        let foundElement = this.piecesHolder.querySelector(`piece[data-id="${piece.id}"][data-owner="${piece.owner}"]`);
        return foundElement;
    }
    getTileElement(tile) {
        let foundElement = this.tilesHolder.querySelector(`tile[data-x="${tile.position.x}"][data-y="${tile.position.y}"]`);
        return foundElement;
    }
    updatePieceElement(piece) {
        // Find the piece
        let pieceElement = this.getPieceElement(piece);
        if (pieceElement == null)
            return;
        // Update it
        pieceElement.setAttribute('data-x', piece.position.x.toString());
        pieceElement.setAttribute('data-y', piece.position.y.toString());
        pieceElement.setAttribute('data-height', piece.height.toString());
    }
    updateTileElement(tile) {
        // Find the tile
        let tileElement = this.getTileElement(tile);
        if (tileElement == null)
            return;
        // Update it
        tileElement.setAttribute('data-in-play', tile.inPlay.toString());
    }
}
exports.HtmlRenderer = HtmlRenderer;
