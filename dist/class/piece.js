"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
class Piece {
    constructor(game, id, owner, position) {
        this.game = game;
        this.id = id;
        this.owner = owner;
        this.position = position;
        this.height = 1;
    }
    move(newPosition) {
        // TODO: Check square is open or has less than 3 pieces on it
        let canMove = true;
        if (canMove) {
            // Set height of tile being moved to
            let tileMovingTo = this.game.tiles.filter(t => t.position.x == newPosition.x && t.position.y == newPosition.y)[0];
            this.height = tileMovingTo.pieces.length + 1;
            // Set the new position
            let oldPosition = this.position;
            this.position = newPosition;
            // Have tile check if it's empty now, and if so, remove it
            let tileMovedOffOf = this.game.tiles.filter(t => t.position.x == oldPosition.x && t.position.y == oldPosition.y)[0];
            if (tileMovedOffOf.isEmpty) {
                tileMovedOffOf.removeFromPlay();
            }
            // Emit event
            this.game.onPieceMoved.emit(this);
        }
    }
}
exports.Piece = Piece;
