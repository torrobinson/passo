(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const player_type_1 = require("../enum/player-type");
const piece_1 = require("./piece");
const point_1 = require("./point");
const tile_1 = require("./tile");
const event_emitter_1 = require("./../events/event-emitter");
class Game {
    constructor() {
        // State
        this.pieces = [];
        this.tiles = [];
        this.turn = player_type_1.PlayerType.Red;
        // Dimensions
        this.height = 5;
        this.width = 5;
        // Events
        this.onPieceCreated = new event_emitter_1.EventEmitter();
        this.onPieceMoved = new event_emitter_1.EventEmitter();
        this.onTileCreated = new event_emitter_1.EventEmitter();
        this.onTileRemovedFromPlay = new event_emitter_1.EventEmitter();
        this.onPlayerTurnStart = new event_emitter_1.EventEmitter();
        this.onPlayerTurnEnd = new event_emitter_1.EventEmitter();
        this.sleep = (milliseconds) => __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        });
    }
    initialize() {
        // Reset everything
        // Setup tiles
        this.resetTiles();
        // Setup pieces on back rows
        this.resetPieces();
    }
    emulatePlay() {
        return __awaiter(this, void 0, void 0, function* () {
            let dur = 500;
            // Black
            let blackPiece = this.pieces.filter(p => p.owner == 'black' && p.id == 1)[0];
            blackPiece.move(new point_1.Point(0, 1));
            yield this.sleep(dur);
            // Red
            let redPiece = this.pieces.filter(p => p.owner == 'red' && p.id == 1)[0];
            redPiece.move(new point_1.Point(1, 3));
            yield this.sleep(dur);
            // Black
            blackPiece.move(new point_1.Point(0, 2));
            yield this.sleep(dur);
            // Red stacks
            redPiece.move(new point_1.Point(2, 4));
            yield this.sleep(dur);
            // Black goes on top
            blackPiece.move(new point_1.Point(1, 2));
            yield this.sleep(dur);
            blackPiece.move(new point_1.Point(2, 3));
            yield this.sleep(dur);
            blackPiece.move(new point_1.Point(2, 4));
            yield this.sleep(dur);
            blackPiece.move(new point_1.Point(3, 3));
            yield this.sleep(dur);
        });
    }
    // Reset state of all tiles
    resetTiles() {
        this.tiles = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let newTile = new tile_1.Tile(this, new point_1.Point(x, y));
                this.createTile(newTile);
            }
        }
    }
    // Resets all piece positions
    resetPieces() {
        this.pieces = [];
        for (let x = 0; x < this.width; x++) {
            // Black on top row
            let newBlack = new piece_1.Piece(this, x + 1, // x pos as ID
            player_type_1.PlayerType.Black, new point_1.Point(x, 0));
            this.createPiece(newBlack);
            // Red on bottom
            let newRed = new piece_1.Piece(this, x + 1, // x pos as ID
            player_type_1.PlayerType.Red, new point_1.Point(x, this.height - 1));
            this.createPiece(newRed);
        }
    }
    // Tile helpers
    createTile(tile) {
        this.tiles.push(tile);
        this.onTileCreated.emit(tile);
    }
    // Piece helpers
    createPiece(piece) {
        this.pieces.push(piece);
        this.onPieceCreated.emit(piece);
    }
    // Turn helpers
    endTurn() {
        // Emit that current players turn ended
        this.onPlayerTurnEnd.emit(this.turn);
        if (this.turn == player_type_1.PlayerType.Black) {
            this.turn = player_type_1.PlayerType.Red;
        }
        else {
            this.turn = player_type_1.PlayerType.Black;
        }
        // Emit that new players turn started
        this.onPlayerTurnStart.emit(this.turn);
    }
}
exports.Game = Game;

},{"../enum/player-type":5,"./../events/event-emitter":6,"./piece":2,"./point":3,"./tile":4}],2:[function(require,module,exports){
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
        let sourceTile = this.game.tiles.filter(t => t.position.x == this.position.x && t.position.y == this.position.y)[0];
        let destinationTile = this.game.tiles.filter(t => t.position.x == newPosition.x && t.position.y == newPosition.y)[0];
        let isInRange = Math.abs(destinationTile.position.x - sourceTile.position.x) <= 1
            && Math.abs(destinationTile.position.y - sourceTile.position.y) <= 1;
        let canMove = destinationTile.inPlay && isInRange && destinationTile.pieces.length < 3;
        if (canMove) {
            // Set height
            this.height = destinationTile.pieces.length + 1;
            // Set the new position
            this.position = newPosition;
            // Have tile check if it's empty now, and if so, remove it
            if (sourceTile.isEmpty) {
                sourceTile.removeFromPlay();
            }
            // Emit event
            this.game.onPieceMoved.emit(this);
            // End turn
            this.game.endTurn();
        }
    }
}
exports.Piece = Piece;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(otherPoint) {
        return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
    }
    get isInBounds() {
        return this.x >= 0 && this.x <= 7
            && this.y >= 0 && this.y <= 7;
    }
    toString() {
        return `{${this.x},${this.y}}`;
    }
}
exports.Point = Point;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerType = void 0;
var PlayerType;
(function (PlayerType) {
    PlayerType["Black"] = "black";
    PlayerType["Red"] = "red";
})(PlayerType || (exports.PlayerType = PlayerType = {}));

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    constructor() {
        this.listeners = [];
        this.listenersOncer = [];
        this.on = (listener) => {
            this.listeners.push(listener);
            return {
                dispose: () => this.off(listener)
            };
        };
        this.once = (listener) => {
            this.listenersOncer.push(listener);
        };
        this.off = (listener) => {
            var callbackIndex = this.listeners.indexOf(listener);
            if (callbackIndex > -1)
                this.listeners.splice(callbackIndex, 1);
        };
        this.emit = (event) => {
            /** Update any general listeners */
            this.listeners.forEach((listener) => listener(event));
            /** Clear the `once` queue */
            if (this.listenersOncer.length > 0) {
                const toCall = this.listenersOncer;
                this.listenersOncer = [];
                toCall.forEach((listener) => listener(event));
            }
        };
        this.pipe = (te) => {
            return this.on((e) => te.emit(e));
        };
    }
}
exports.EventEmitter = EventEmitter;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./class/game");
const html_renderer_1 = require("./renderers/html-renderer");
document.addEventListener("DOMContentLoaded", () => {
    // Create our game and renderer
    let renderer = new html_renderer_1.HtmlRenderer();
    let game = new game_1.Game();
    // Set up the renderer to listen for game events
    renderer.bindToGame(game);
    // Initialize the game
    game.initialize();
    setTimeout(() => {
        game.emulatePlay();
    }, 1000);
});

},{"./class/game":1,"./renderers/html-renderer":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlRenderer = void 0;
const game_1 = require("../class/game");
const html_utilities_1 = require("../utility/html-utilities");
class HtmlRenderer {
    constructor() {
        this.game = new game_1.Game();
        this.tilesHolder = document.querySelector('.board .tiles');
        this.piecesHolder = document.querySelector('.board .pieces');
        this.turnHint = document.querySelector('.turn-hint');
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
            // Set as last active so we can keep it on-top of other pieces, visually
            this.setPieceAsLastActive(piece);
        });
        // When a turn starts
        this.game.onPlayerTurnStart.on((player) => {
            this.turnHint.classList.remove('red');
            this.turnHint.classList.remove('black');
            this.turnHint.classList.add(player);
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
    setPieceAsLastActive(piece) {
        let pieceElement = this.getPieceElement(piece);
        let lastActiveClass = 'last-active-piece';
        // Remove from all elements
        this.piecesHolder.querySelectorAll('piece').forEach(p => {
            p.classList.remove(lastActiveClass);
        });
        // Add to this one
        pieceElement.classList.add(lastActiveClass);
    }
}
exports.HtmlRenderer = HtmlRenderer;

},{"../class/game":1,"../utility/html-utilities":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlUtilities = void 0;
class HtmlUtilities {
    static elementFromString(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
}
exports.HtmlUtilities = HtmlUtilities;

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jbGFzcy9nYW1lLnRzIiwic3JjL3NjcmlwdHMvY2xhc3MvcGllY2UudHMiLCJzcmMvc2NyaXB0cy9jbGFzcy9wb2ludC50cyIsInNyYy9zY3JpcHRzL2NsYXNzL3RpbGUudHMiLCJzcmMvc2NyaXB0cy9lbnVtL3BsYXllci10eXBlLnRzIiwic3JjL3NjcmlwdHMvZXZlbnRzL2V2ZW50LWVtaXR0ZXIudHMiLCJzcmMvc2NyaXB0cy9tYWluLnRzIiwic3JjL3NjcmlwdHMvcmVuZGVyZXJzL2h0bWwtcmVuZGVyZXIudHMiLCJzcmMvc2NyaXB0cy91dGlsaXR5L2h0bWwtdXRpbGl0aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDQUEscURBQWlEO0FBQ2pELG1DQUFnQztBQUNoQyxtQ0FBZ0M7QUFDaEMsaUNBQThCO0FBQzlCLDZEQUF5RDtBQUV6RCxNQUFhLElBQUk7SUFBakI7UUFFQyxRQUFRO1FBQ0QsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUNyQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFNBQUksR0FBZSx3QkFBVSxDQUFDLEdBQUcsQ0FBQztRQUV6QyxhQUFhO1FBQ0wsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRTFCLFNBQVM7UUFDRixtQkFBYyxHQUF3QixJQUFJLDRCQUFZLEVBQVMsQ0FBQztRQUNoRSxpQkFBWSxHQUF3QixJQUFJLDRCQUFZLEVBQVMsQ0FBQztRQUM5RCxrQkFBYSxHQUF1QixJQUFJLDRCQUFZLEVBQVEsQ0FBQztRQUM3RCwwQkFBcUIsR0FBdUIsSUFBSSw0QkFBWSxFQUFRLENBQUM7UUFDckUsc0JBQWlCLEdBQTZCLElBQUksNEJBQVksRUFBYyxDQUFDO1FBQzdFLG9CQUFlLEdBQTZCLElBQUksNEJBQVksRUFBYyxDQUFDO1FBY2xGLFVBQUssR0FB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LEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxLQUFZO1FBQ3hDLElBQUksWUFBWSxHQUFnQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBQzdELElBQUksZUFBZSxHQUFXLG1CQUFtQixDQUFDO1FBRWxELDJCQUEyQjtRQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2RCxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFrQjtRQUNsQixZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUU3QyxDQUFDO0NBQ0Q7QUF6R0Qsb0NBeUdDOzs7Ozs7QUMvR0QsTUFBc0IsYUFBYTtJQUNsQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBa0I7UUFDMUMsSUFBSSxHQUFHLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckQsR0FBRyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEMsT0FBTyxHQUFHLENBQUMsVUFBMEIsQ0FBQztJQUN2QyxDQUFDO0NBOEJEO0FBbkNELHNDQW1DQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFBsYXllclR5cGUgfSBmcm9tIFwiLi4vZW51bS9wbGF5ZXItdHlwZVwiO1xyXG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gXCIuL3BpZWNlXCI7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vLi4vZXZlbnRzL2V2ZW50LWVtaXR0ZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuXHJcblx0Ly8gU3RhdGVcclxuXHRwdWJsaWMgcGllY2VzOiBQaWVjZVtdID0gW107XHJcblx0cHVibGljIHRpbGVzOiBUaWxlW10gPSBbXTtcclxuXHRwdWJsaWMgdHVybjogUGxheWVyVHlwZSA9IFBsYXllclR5cGUuUmVkO1xyXG5cclxuXHQvLyBEaW1lbnNpb25zXHJcblx0cHJpdmF0ZSBoZWlnaHQ6IG51bWJlciA9IDU7XHJcblx0cHJpdmF0ZSB3aWR0aDogbnVtYmVyID0gNTtcclxuXHJcblx0Ly8gRXZlbnRzXHJcblx0cHVibGljIG9uUGllY2VDcmVhdGVkOiBFdmVudEVtaXR0ZXI8UGllY2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxQaWVjZT4oKTtcclxuXHRwdWJsaWMgb25QaWVjZU1vdmVkOiBFdmVudEVtaXR0ZXI8UGllY2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxQaWVjZT4oKTtcclxuXHRwdWJsaWMgb25UaWxlQ3JlYXRlZDogRXZlbnRFbWl0dGVyPFRpbGU+ID0gbmV3IEV2ZW50RW1pdHRlcjxUaWxlPigpO1xyXG5cdHB1YmxpYyBvblRpbGVSZW1vdmVkRnJvbVBsYXk6IEV2ZW50RW1pdHRlcjxUaWxlPiA9IG5ldyBFdmVudEVtaXR0ZXI8VGlsZT4oKTtcclxuXHRwdWJsaWMgb25QbGF5ZXJUdXJuU3RhcnQ6IEV2ZW50RW1pdHRlcjxQbGF5ZXJUeXBlPiA9IG5ldyBFdmVudEVtaXR0ZXI8UGxheWVyVHlwZT4oKTtcclxuXHRwdWJsaWMgb25QbGF5ZXJUdXJuRW5kOiBFdmVudEVtaXR0ZXI8UGxheWVyVHlwZT4gPSBuZXcgRXZlbnRFbWl0dGVyPFBsYXllclR5cGU+KCk7XHJcblxyXG5cclxuXHRwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcclxuXHRcdC8vIFJlc2V0IGV2ZXJ5dGhpbmdcclxuXHJcblx0XHQvLyBTZXR1cCB0aWxlc1xyXG5cdFx0dGhpcy5yZXNldFRpbGVzKCk7XHJcblxyXG5cdFx0Ly8gU2V0dXAgcGllY2VzIG9uIGJhY2sgcm93c1xyXG5cdFx0dGhpcy5yZXNldFBpZWNlcygpO1xyXG5cdH1cclxuXHJcblxyXG5cdHNsZWVwID0gYXN5bmMgKG1pbGxpc2Vjb25kczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1pbGxpc2Vjb25kcykpO1xyXG5cdH07XHJcblx0cHVibGljIGFzeW5jIGVtdWxhdGVQbGF5KCk6IFByb21pc2U8dm9pZD4ge1xyXG5cdFx0bGV0IGR1cjogbnVtYmVyID0gNTAwO1xyXG5cclxuXHRcdC8vIEJsYWNrXHJcblx0XHRsZXQgYmxhY2tQaWVjZTogUGllY2UgPSB0aGlzLnBpZWNlcy5maWx0ZXIocCA9PiBwLm93bmVyID09ICdibGFjaycgJiYgcC5pZCA9PSAxKVswXTtcclxuXHRcdGJsYWNrUGllY2UubW92ZShuZXcgUG9pbnQoMCwgMSkpO1xyXG5cdFx0YXdhaXQgdGhpcy5zbGVlcChkdXIpO1xyXG5cclxuXHRcdC8vIFJlZFxyXG5cdFx0bGV0IHJlZFBpZWNlOiBQaWVjZSA9IHRoaXMucGllY2VzLmZpbHRlcihwID0+IHAub3duZXIgPT0gJ3JlZCcgJiYgcC5pZCA9PSAxKVswXTtcclxuXHRcdHJlZFBpZWNlLm1vdmUobmV3IFBvaW50KDEsIDMpKTtcclxuXHRcdGF3YWl0IHRoaXMuc2xlZXAoZHVyKTtcclxuXHJcblx0XHQvLyBCbGFja1xyXG5cdFx0YmxhY2tQaWVjZS5tb3ZlKG5ldyBQb2ludCgwLCAyKSk7XHJcblx0XHRhd2FpdCB0aGlzLnNsZWVwKGR1cik7XHJcblxyXG5cdFx0Ly8gUmVkIHN0YWNrc1xyXG5cdFx0cmVkUGllY2UubW92ZShuZXcgUG9pbnQoMiwgNCkpO1xyXG5cdFx0YXdhaXQgdGhpcy5zbGVlcChkdXIpO1xyXG5cclxuXHRcdC8vIEJsYWNrIGdvZXMgb24gdG9wXHJcblx0XHRibGFja1BpZWNlLm1vdmUobmV3IFBvaW50KDEsIDIpKTtcclxuXHRcdGF3YWl0IHRoaXMuc2xlZXAoZHVyKTtcclxuXHRcdGJsYWNrUGllY2UubW92ZShuZXcgUG9pbnQoMiwgMykpO1xyXG5cdFx0YXdhaXQgdGhpcy5zbGVlcChkdXIpO1xyXG5cdFx0YmxhY2tQaWVjZS5tb3ZlKG5ldyBQb2ludCgyLCA0KSk7XHJcblx0XHRhd2FpdCB0aGlzLnNsZWVwKGR1cik7XHJcblxyXG5cdFx0YmxhY2tQaWVjZS5tb3ZlKG5ldyBQb2ludCgzLCAzKSk7XHJcblx0XHRhd2FpdCB0aGlzLnNsZWVwKGR1cik7XHJcblx0fVxyXG5cclxuXHQvLyBSZXNldCBzdGF0ZSBvZiBhbGwgdGlsZXNcclxuXHRwcml2YXRlIHJlc2V0VGlsZXMoKTogdm9pZCB7XHJcblx0XHR0aGlzLnRpbGVzID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgeDogbnVtYmVyID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xyXG5cdFx0XHRmb3IgKGxldCB5OiBudW1iZXIgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xyXG5cdFx0XHRcdGxldCBuZXdUaWxlID0gbmV3IFRpbGUodGhpcywgbmV3IFBvaW50KHgsIHkpKTtcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZVRpbGUobmV3VGlsZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFJlc2V0cyBhbGwgcGllY2UgcG9zaXRpb25zXHJcblx0cHJpdmF0ZSByZXNldFBpZWNlcygpOiB2b2lkIHtcclxuXHRcdHRoaXMucGllY2VzID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgeDogbnVtYmVyID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xyXG5cclxuXHRcdFx0Ly8gQmxhY2sgb24gdG9wIHJvd1xyXG5cdFx0XHRsZXQgbmV3QmxhY2s6IFBpZWNlID0gbmV3IFBpZWNlKFxyXG5cdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0eCArIDEsIC8vIHggcG9zIGFzIElEXHJcblx0XHRcdFx0UGxheWVyVHlwZS5CbGFjayxcclxuXHRcdFx0XHRuZXcgUG9pbnQoeCwgMClcclxuXHRcdFx0KTtcclxuXHRcdFx0dGhpcy5jcmVhdGVQaWVjZShuZXdCbGFjayk7XHJcblxyXG5cdFx0XHQvLyBSZWQgb24gYm90dG9tXHJcblx0XHRcdGxldCBuZXdSZWQ6IFBpZWNlID0gbmV3IFBpZWNlKFxyXG5cdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0eCArIDEsIC8vIHggcG9zIGFzIElEXHJcblx0XHRcdFx0UGxheWVyVHlwZS5SZWQsXHJcblx0XHRcdFx0bmV3IFBvaW50KHgsIHRoaXMuaGVpZ2h0IC0gMSlcclxuXHRcdFx0KTtcclxuXHRcdFx0dGhpcy5jcmVhdGVQaWVjZShuZXdSZWQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gVGlsZSBoZWxwZXJzXHJcblx0cHJpdmF0ZSBjcmVhdGVUaWxlKHRpbGU6IFRpbGUpOiB2b2lkIHtcclxuXHRcdHRoaXMudGlsZXMucHVzaCh0aWxlKTtcclxuXHRcdHRoaXMub25UaWxlQ3JlYXRlZC5lbWl0KHRpbGUpO1xyXG5cdH1cclxuXHJcblx0Ly8gUGllY2UgaGVscGVyc1xyXG5cdHByaXZhdGUgY3JlYXRlUGllY2UocGllY2U6IFBpZWNlKTogdm9pZCB7XHJcblx0XHR0aGlzLnBpZWNlcy5wdXNoKHBpZWNlKTtcclxuXHRcdHRoaXMub25QaWVjZUNyZWF0ZWQuZW1pdChwaWVjZSk7XHJcblx0fVxyXG5cclxuXHQvLyBUdXJuIGhlbHBlcnNcclxuXHRwdWJsaWMgZW5kVHVybigpOiB2b2lkIHtcclxuXHJcblx0XHQvLyBFbWl0IHRoYXQgY3VycmVudCBwbGF5ZXJzIHR1cm4gZW5kZWRcclxuXHRcdHRoaXMub25QbGF5ZXJUdXJuRW5kLmVtaXQodGhpcy50dXJuKTtcclxuXHJcblx0XHRpZiAodGhpcy50dXJuID09IFBsYXllclR5cGUuQmxhY2spIHtcclxuXHRcdFx0dGhpcy50dXJuID0gUGxheWVyVHlwZS5SZWQ7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dGhpcy50dXJuID0gUGxheWVyVHlwZS5CbGFjaztcclxuXHRcdH1cclxuXHJcblx0XHQvLyBFbWl0IHRoYXQgbmV3IHBsYXllcnMgdHVybiBzdGFydGVkXHJcblx0XHR0aGlzLm9uUGxheWVyVHVyblN0YXJ0LmVtaXQodGhpcy50dXJuKTtcclxuXHR9XHJcblxyXG59IiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuaW1wb3J0IHsgUGxheWVyVHlwZSB9IGZyb20gXCIuLi9lbnVtL3BsYXllci10eXBlXCI7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQaWVjZSB7XHJcblx0aWQ6IG51bWJlcjtcclxuXHRnYW1lOiBHYW1lO1xyXG5cdG93bmVyOiBQbGF5ZXJUeXBlO1xyXG5cdHBvc2l0aW9uOiBQb2ludDtcclxuXHRoZWlnaHQ6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoZ2FtZTogR2FtZSwgaWQ6IG51bWJlciwgb3duZXI6IFBsYXllclR5cGUsIHBvc2l0aW9uOiBQb2ludCkge1xyXG5cdFx0dGhpcy5nYW1lID0gZ2FtZTtcclxuXHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdHRoaXMub3duZXIgPSBvd25lcjtcclxuXHRcdHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHRcdHRoaXMuaGVpZ2h0ID0gMTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBtb3ZlKG5ld1Bvc2l0aW9uOiBQb2ludCk6IHZvaWQge1xyXG5cdFx0bGV0IHNvdXJjZVRpbGU6IFRpbGUgPSB0aGlzLmdhbWUudGlsZXMuZmlsdGVyKHQgPT4gdC5wb3NpdGlvbi54ID09IHRoaXMucG9zaXRpb24ueCAmJiB0LnBvc2l0aW9uLnkgPT0gdGhpcy5wb3NpdGlvbi55KVswXTtcclxuXHRcdGxldCBkZXN0aW5hdGlvblRpbGU6IFRpbGUgPSB0aGlzLmdhbWUudGlsZXMuZmlsdGVyKHQgPT4gdC5wb3NpdGlvbi54ID09IG5ld1Bvc2l0aW9uLnggJiYgdC5wb3NpdGlvbi55ID09IG5ld1Bvc2l0aW9uLnkpWzBdO1xyXG5cclxuXHRcdGxldCBpc0luUmFuZ2U6IGJvb2xlYW4gPSBNYXRoLmFicyhkZXN0aW5hdGlvblRpbGUucG9zaXRpb24ueCAtIHNvdXJjZVRpbGUucG9zaXRpb24ueCkgPD0gMVxyXG5cdFx0XHQmJiBNYXRoLmFicyhkZXN0aW5hdGlvblRpbGUucG9zaXRpb24ueSAtIHNvdXJjZVRpbGUucG9zaXRpb24ueSkgPD0gMTtcclxuXHJcblx0XHRsZXQgY2FuTW92ZTogYm9vbGVhbiA9IGRlc3RpbmF0aW9uVGlsZS5pblBsYXkgJiYgaXNJblJhbmdlICYmIGRlc3RpbmF0aW9uVGlsZS5waWVjZXMubGVuZ3RoIDwgMztcclxuXHJcblx0XHRpZiAoY2FuTW92ZSkge1xyXG5cdFx0XHQvLyBTZXQgaGVpZ2h0XHJcblx0XHRcdHRoaXMuaGVpZ2h0ID0gZGVzdGluYXRpb25UaWxlLnBpZWNlcy5sZW5ndGggKyAxO1xyXG5cclxuXHRcdFx0Ly8gU2V0IHRoZSBuZXcgcG9zaXRpb25cclxuXHRcdFx0dGhpcy5wb3NpdGlvbiA9IG5ld1Bvc2l0aW9uO1xyXG5cclxuXHRcdFx0Ly8gSGF2ZSB0aWxlIGNoZWNrIGlmIGl0J3MgZW1wdHkgbm93LCBhbmQgaWYgc28sIHJlbW92ZSBpdFxyXG5cclxuXHRcdFx0aWYgKHNvdXJjZVRpbGUuaXNFbXB0eSkge1xyXG5cdFx0XHRcdHNvdXJjZVRpbGUucmVtb3ZlRnJvbVBsYXkoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRW1pdCBldmVudFxyXG5cdFx0XHR0aGlzLmdhbWUub25QaWVjZU1vdmVkLmVtaXQodGhpcyk7XHJcblxyXG5cdFx0XHQvLyBFbmQgdHVyblxyXG5cdFx0XHR0aGlzLmdhbWUuZW5kVHVybigpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBQb2ludCB7XHJcblx0eDogbnVtYmVyO1xyXG5cdHk6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZChvdGhlclBvaW50OiBQb2ludCk6IFBvaW50IHtcclxuXHRcdHJldHVybiBuZXcgUG9pbnQodGhpcy54ICsgb3RoZXJQb2ludC54LCB0aGlzLnkgKyBvdGhlclBvaW50LnkpO1xyXG5cdH1cclxuXHJcblx0Z2V0IGlzSW5Cb3VuZHMoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy54ID49IDAgJiYgdGhpcy54IDw9IDdcclxuXHRcdFx0JiYgdGhpcy55ID49IDAgJiYgdGhpcy55IDw9IDdcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGB7JHt0aGlzLnh9LCR7dGhpcy55fX1gO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XHJcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSBcIi4vcGllY2VcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRpbGUge1xyXG5cdGdhbWU6IEdhbWU7XHJcblx0cG9zaXRpb246IFBvaW50O1xyXG5cdGluUGxheTogYm9vbGVhbjtcclxuXHJcblx0Y29uc3RydWN0b3IoZ2FtZTogR2FtZSwgcG9zaXRpb246IFBvaW50KSB7XHJcblx0XHR0aGlzLmdhbWUgPSBnYW1lO1xyXG5cdFx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cclxuXHRcdC8vIERlZmF1bHQgdG8gaW4tcGxheVxyXG5cdFx0dGhpcy5pblBsYXkgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBwaWVjZXMoKTogUGllY2VbXSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nYW1lLnBpZWNlcy5maWx0ZXIocCA9PiBwLnBvc2l0aW9uLnggPT0gdGhpcy5wb3NpdGlvbi54ICYmIHAucG9zaXRpb24ueSA9PSB0aGlzLnBvc2l0aW9uLnkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMucGllY2VzLmxlbmd0aCA9PSAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZUZyb21QbGF5KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5pblBsYXkgPSBmYWxzZTtcclxuXHRcdHRoaXMuZ2FtZS5vblRpbGVSZW1vdmVkRnJvbVBsYXkuZW1pdCh0aGlzKTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZW51bSBQbGF5ZXJUeXBlIHtcclxuXHRCbGFjayA9ICdibGFjaycsXHJcblx0UmVkID0gJ3JlZCdcclxufSIsImV4cG9ydCBpbnRlcmZhY2UgTGlzdGVuZXI8VD4ge1xyXG5cdChldmVudDogVCk6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEaXNwb3NhYmxlIHtcclxuXHRkaXNwb3NlKCk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXI8VD4ge1xyXG5cdHByaXZhdGUgbGlzdGVuZXJzOiBMaXN0ZW5lcjxUPltdID0gW107XHJcblx0cHJpdmF0ZSBsaXN0ZW5lcnNPbmNlcjogTGlzdGVuZXI8VD5bXSA9IFtdO1xyXG5cclxuXHRvbiA9IChsaXN0ZW5lcjogTGlzdGVuZXI8VD4pOiBEaXNwb3NhYmxlID0+IHtcclxuXHRcdHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZGlzcG9zZTogKCkgPT4gdGhpcy5vZmYobGlzdGVuZXIpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0b25jZSA9IChsaXN0ZW5lcjogTGlzdGVuZXI8VD4pOiB2b2lkID0+IHtcclxuXHRcdHRoaXMubGlzdGVuZXJzT25jZXIucHVzaChsaXN0ZW5lcik7XHJcblx0fVxyXG5cclxuXHRvZmYgPSAobGlzdGVuZXI6IExpc3RlbmVyPFQ+KSA9PiB7XHJcblx0XHR2YXIgY2FsbGJhY2tJbmRleCA9IHRoaXMubGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xyXG5cdFx0aWYgKGNhbGxiYWNrSW5kZXggPiAtMSkgdGhpcy5saXN0ZW5lcnMuc3BsaWNlKGNhbGxiYWNrSW5kZXgsIDEpO1xyXG5cdH1cclxuXHJcblx0ZW1pdCA9IChldmVudDogVCkgPT4ge1xyXG5cdFx0LyoqIFVwZGF0ZSBhbnkgZ2VuZXJhbCBsaXN0ZW5lcnMgKi9cclxuXHRcdHRoaXMubGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcihldmVudCkpO1xyXG5cclxuXHRcdC8qKiBDbGVhciB0aGUgYG9uY2VgIHF1ZXVlICovXHJcblx0XHRpZiAodGhpcy5saXN0ZW5lcnNPbmNlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGNvbnN0IHRvQ2FsbCA9IHRoaXMubGlzdGVuZXJzT25jZXI7XHJcblx0XHRcdHRoaXMubGlzdGVuZXJzT25jZXIgPSBbXTtcclxuXHRcdFx0dG9DYWxsLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcihldmVudCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cGlwZSA9ICh0ZTogRXZlbnRFbWl0dGVyPFQ+KTogRGlzcG9zYWJsZSA9PiB7XHJcblx0XHRyZXR1cm4gdGhpcy5vbigoZSkgPT4gdGUuZW1pdChlKSk7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2NsYXNzL2dhbWVcIjtcclxuaW1wb3J0IHsgSHRtbFJlbmRlcmVyIH0gZnJvbSBcIi4vcmVuZGVyZXJzL2h0bWwtcmVuZGVyZXJcIjtcclxuXHJcblxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xyXG5cdC8vIENyZWF0ZSBvdXIgZ2FtZSBhbmQgcmVuZGVyZXJcclxuXHRsZXQgcmVuZGVyZXI6IEh0bWxSZW5kZXJlciA9IG5ldyBIdG1sUmVuZGVyZXIoKTtcclxuXHRsZXQgZ2FtZTogR2FtZSA9IG5ldyBHYW1lKCk7XHJcblxyXG5cdC8vIFNldCB1cCB0aGUgcmVuZGVyZXIgdG8gbGlzdGVuIGZvciBnYW1lIGV2ZW50c1xyXG5cdHJlbmRlcmVyLmJpbmRUb0dhbWUoZ2FtZSk7XHJcblxyXG5cdC8vIEluaXRpYWxpemUgdGhlIGdhbWVcclxuXHRnYW1lLmluaXRpYWxpemUoKTtcclxuXHJcblx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRnYW1lLmVtdWxhdGVQbGF5KCk7XHJcblx0fSwgMTAwMCk7XHJcbn0pOyIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vY2xhc3MvZ2FtZVwiO1xyXG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gXCIuLi9jbGFzcy9waWVjZVwiO1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4uL2NsYXNzL3RpbGVcIjtcclxuaW1wb3J0IHsgUGxheWVyVHlwZSB9IGZyb20gXCIuLi9lbnVtL3BsYXllci10eXBlXCI7XHJcbmltcG9ydCB7IEh0bWxVdGlsaXRpZXMgfSBmcm9tIFwiLi4vdXRpbGl0eS9odG1sLXV0aWxpdGllc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEh0bWxSZW5kZXJlciB7XHJcblx0Z2FtZTogR2FtZTtcclxuXHJcblx0dGlsZXNIb2xkZXI6IEhUTUxFbGVtZW50O1xyXG5cdHBpZWNlc0hvbGRlcjogSFRNTEVsZW1lbnQ7XHJcblxyXG5cdHR1cm5IaW50OiBIVE1MRWxlbWVudDtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmdhbWUgPSBuZXcgR2FtZSgpO1xyXG5cclxuXHRcdHRoaXMudGlsZXNIb2xkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQgLnRpbGVzJykhO1xyXG5cdFx0dGhpcy5waWVjZXNIb2xkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQgLnBpZWNlcycpITtcclxuXHJcblx0XHR0aGlzLnR1cm5IaW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm4taGludCcpITtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBiaW5kVG9HYW1lKGdhbWU6IEdhbWUpOiB2b2lkIHtcclxuXHRcdHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG5cdFx0Ly8gV2hlbiBhIHRpbGUgaXMgY3JlYXRlZFxyXG5cdFx0dGhpcy5nYW1lLm9uVGlsZUNyZWF0ZWQub24oKHRpbGU6IFRpbGUpID0+IHtcclxuXHRcdFx0bGV0IG5ld1RpbGU6IEhUTUxFbGVtZW50ID0gSHRtbFV0aWxpdGllcy5lbGVtZW50RnJvbVN0cmluZyhgXHJcblx0XHRcdFx0PHRpbGUgZGF0YS14PVwiJHt0aWxlLnBvc2l0aW9uLnh9XCIgZGF0YS15PVwiJHt0aWxlLnBvc2l0aW9uLnl9XCIgZGF0YS1pbi1wbGF5PVwiJHt0aWxlLmluUGxheX1cIj5cclxuXHRcdFx0XHQ8L3RpbGU+XHJcblx0XHRcdGApO1xyXG5cclxuXHRcdFx0dGhpcy50aWxlc0hvbGRlci5hcHBlbmRDaGlsZChuZXdUaWxlKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFdoZW4gYSB0aWxlIGlzIHJlbW92ZWQgZnJvbSBwbGF5XHJcblx0XHR0aGlzLmdhbWUub25UaWxlUmVtb3ZlZEZyb21QbGF5Lm9uKCh0aWxlOiBUaWxlKSA9PiB7XHJcblx0XHRcdHRoaXMudXBkYXRlVGlsZUVsZW1lbnQodGlsZSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBXaGVuIGEgcGllY2UgaXMgY3JlYXRlZFxyXG5cdFx0dGhpcy5nYW1lLm9uUGllY2VDcmVhdGVkLm9uKChwaWVjZTogUGllY2UpID0+IHtcclxuXHRcdFx0bGV0IG5ld1BpZWNlOiBIVE1MRWxlbWVudCA9IEh0bWxVdGlsaXRpZXMuZWxlbWVudEZyb21TdHJpbmcoYFxyXG5cdFx0XHRcdDxwaWVjZSBkYXRhLWlkPVwiJHtwaWVjZS5pZH1cIiBkYXRhLXg9XCIke3BpZWNlLnBvc2l0aW9uLnh9XCIgZGF0YS15PVwiJHtwaWVjZS5wb3NpdGlvbi55fVwiIGRhdGEtb3duZXI9XCIke3BpZWNlLm93bmVyfVwiIGRhdGEtaGVpZ2h0PVwiJHtwaWVjZS5oZWlnaHR9XCI+XHJcblx0XHRcdFx0PC9waWVjZT5cclxuXHRcdFx0YCk7XHJcblxyXG5cdFx0XHR0aGlzLnBpZWNlc0hvbGRlci5hcHBlbmRDaGlsZChuZXdQaWVjZSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBXaGVuIGEgcGllY2UgbW92ZXNcclxuXHRcdHRoaXMuZ2FtZS5vblBpZWNlTW92ZWQub24oKHBpZWNlOiBQaWVjZSkgPT4ge1xyXG5cdFx0XHQvLyBVcGRhdGUgaXRcclxuXHRcdFx0dGhpcy51cGRhdGVQaWVjZUVsZW1lbnQocGllY2UpO1xyXG5cclxuXHRcdFx0Ly8gU2V0IGFzIGxhc3QgYWN0aXZlIHNvIHdlIGNhbiBrZWVwIGl0IG9uLXRvcCBvZiBvdGhlciBwaWVjZXMsIHZpc3VhbGx5XHJcblx0XHRcdHRoaXMuc2V0UGllY2VBc0xhc3RBY3RpdmUocGllY2UpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gV2hlbiBhIHR1cm4gc3RhcnRzXHJcblx0XHR0aGlzLmdhbWUub25QbGF5ZXJUdXJuU3RhcnQub24oKHBsYXllcjogUGxheWVyVHlwZSkgPT4ge1xyXG5cdFx0XHR0aGlzLnR1cm5IaW50LmNsYXNzTGlzdC5yZW1vdmUoJ3JlZCcpO1xyXG5cdFx0XHR0aGlzLnR1cm5IaW50LmNsYXNzTGlzdC5yZW1vdmUoJ2JsYWNrJyk7XHJcblx0XHRcdHRoaXMudHVybkhpbnQuY2xhc3NMaXN0LmFkZChwbGF5ZXIpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldFBpZWNlRWxlbWVudChwaWVjZTogUGllY2UpOiBIVE1MRWxlbWVudCB8IG51bGwge1xyXG5cdFx0bGV0IGZvdW5kRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5waWVjZXNIb2xkZXIucXVlcnlTZWxlY3RvcihgcGllY2VbZGF0YS1pZD1cIiR7cGllY2UuaWR9XCJdW2RhdGEtb3duZXI9XCIke3BpZWNlLm93bmVyfVwiXWApO1xyXG5cdFx0cmV0dXJuIGZvdW5kRWxlbWVudDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0VGlsZUVsZW1lbnQodGlsZTogVGlsZSk6IEhUTUxFbGVtZW50IHwgbnVsbCB7XHJcblx0XHRsZXQgZm91bmRFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSB0aGlzLnRpbGVzSG9sZGVyLnF1ZXJ5U2VsZWN0b3IoYHRpbGVbZGF0YS14PVwiJHt0aWxlLnBvc2l0aW9uLnh9XCJdW2RhdGEteT1cIiR7dGlsZS5wb3NpdGlvbi55fVwiXWApO1xyXG5cdFx0cmV0dXJuIGZvdW5kRWxlbWVudDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgdXBkYXRlUGllY2VFbGVtZW50KHBpZWNlOiBQaWVjZSkge1xyXG5cdFx0Ly8gRmluZCB0aGUgcGllY2VcclxuXHRcdGxldCBwaWVjZUVsZW1lbnQgPSB0aGlzLmdldFBpZWNlRWxlbWVudChwaWVjZSk7XHJcblx0XHRpZiAocGllY2VFbGVtZW50ID09IG51bGwpIHJldHVybjtcclxuXHJcblx0XHQvLyBVcGRhdGUgaXRcclxuXHRcdHBpZWNlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIHBpZWNlLnBvc2l0aW9uLngudG9TdHJpbmcoKSk7XHJcblx0XHRwaWVjZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXknLCBwaWVjZS5wb3NpdGlvbi55LnRvU3RyaW5nKCkpO1xyXG5cdFx0cGllY2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1oZWlnaHQnLCBwaWVjZS5oZWlnaHQudG9TdHJpbmcoKSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHVwZGF0ZVRpbGVFbGVtZW50KHRpbGU6IFRpbGUpIHtcclxuXHRcdC8vIEZpbmQgdGhlIHRpbGVcclxuXHRcdGxldCB0aWxlRWxlbWVudCA9IHRoaXMuZ2V0VGlsZUVsZW1lbnQodGlsZSk7XHJcblx0XHRpZiAodGlsZUVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIFVwZGF0ZSBpdFxyXG5cdFx0dGlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWluLXBsYXknLCB0aWxlLmluUGxheS50b1N0cmluZygpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc2V0UGllY2VBc0xhc3RBY3RpdmUocGllY2U6IFBpZWNlKSB7XHJcblx0XHRsZXQgcGllY2VFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuZ2V0UGllY2VFbGVtZW50KHBpZWNlKSE7XHJcblx0XHRsZXQgbGFzdEFjdGl2ZUNsYXNzOiBzdHJpbmcgPSAnbGFzdC1hY3RpdmUtcGllY2UnO1xyXG5cclxuXHRcdC8vIFJlbW92ZSBmcm9tIGFsbCBlbGVtZW50c1xyXG5cdFx0dGhpcy5waWVjZXNIb2xkZXIucXVlcnlTZWxlY3RvckFsbCgncGllY2UnKS5mb3JFYWNoKHAgPT4ge1xyXG5cdFx0XHRwLmNsYXNzTGlzdC5yZW1vdmUobGFzdEFjdGl2ZUNsYXNzKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEFkZCB0byB0aGlzIG9uZVxyXG5cdFx0cGllY2VFbGVtZW50LmNsYXNzTGlzdC5hZGQobGFzdEFjdGl2ZUNsYXNzKTtcclxuXHJcblx0fVxyXG59IiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEh0bWxVdGlsaXRpZXMge1xyXG5cdHN0YXRpYyBlbGVtZW50RnJvbVN0cmluZyhodG1sU3RyaW5nOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcblx0XHRsZXQgZGl2OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0ZGl2LmlubmVySFRNTCA9IGh0bWxTdHJpbmcudHJpbSgpO1xyXG5cdFx0cmV0dXJuIGRpdi5maXJzdENoaWxkISBhcyBIVE1MRWxlbWVudDtcclxuXHR9XHJcblxyXG5cdC8vIHN0YXRpYyByZW1vdmVDbGFzc0Zyb21FbGVtZW50cyhxdWVyeVNlbGVjdG9yOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCB7XHJcblx0Ly8gXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5U2VsZWN0b3IpLmZvckVhY2goKGVsOiBFbGVtZW50KSA9PiB7XHJcblx0Ly8gXHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuXHQvLyBcdH0pO1xyXG5cdC8vIH1cclxuXHJcblx0Ly8gc3RhdGljIGFkZENsYXNzRnJvbUVsZW1lbnRzKHF1ZXJ5U2VsZWN0b3I6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHQvLyBcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnlTZWxlY3RvcikuZm9yRWFjaCgoZWw6IEVsZW1lbnQpID0+IHtcclxuXHQvLyBcdFx0ZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG5cdC8vIFx0fSk7XHJcblx0Ly8gfVxyXG5cclxuXHQvLyBzdGF0aWMgbGl2ZUJpbmQoZXZlbnRUeXBlLCBlbGVtZW50UXVlcnlTZWxlY3RvciwgY2IpIHtcclxuXHQvLyBcdC8vZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIpO1xyXG5cdC8vIFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50ID0+IHtcclxuXHQvLyBcdFx0bGV0IGVsID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoZWxlbWVudFF1ZXJ5U2VsZWN0b3IpO1xyXG5cdC8vIFx0XHRpZiAoZWwpIHtcclxuXHQvLyBcdFx0XHRjYi5jYWxsKHRoaXMsIGVsLCBldmVudCk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH0pO1xyXG5cdC8vIH1cclxuXHJcblx0Ly8gc3RhdGljIHNoYWtlKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG5cdC8vIFx0ZWwuY2xhc3NMaXN0LmFkZCgnc2hha2UnKTtcclxuXHQvLyBcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdC8vIFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKCdzaGFrZScpO1xyXG5cdC8vIFx0fSwgMzUwKTtcclxuXHQvLyB9XHJcbn0iXX0=
