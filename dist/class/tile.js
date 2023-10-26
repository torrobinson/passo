"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
class Tile {
    constructor(game, position) {
        this.game = game;
        this.position = position;
        // Default to in-play
        this.inPlay = true;
    }
    get pieces() {
        return this.game.pieces.filter(p => p.position.x == this.position.x && p.position.y == this.position.y);
    }
    get isEmpty() {
        return this.pieces.length == 0;
    }
    removeFromPlay() {
        this.inPlay = false;
        this.game.onTileRemovedFromPlay.emit(this);
    }
}
exports.Tile = Tile;
