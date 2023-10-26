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
const movable_piece_1 = require("./movable-piece");
const rules_1 = require("./rules");
const on_player_turn_start_event_args_1 = require("../events/on-player-turn-start-event-args");
class Game {
    constructor() {
        // Rules and constraints
        this.rules = new rules_1.Rules();
        // State
        this.pieces = [];
        this.tiles = [];
        this.turnPlayer = player_type_1.PlayerType.Red;
        // Dimensions
        this.height = 5;
        this.width = 5;
        // Events
        this.onGameStart = new event_emitter_1.EventEmitter();
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
        // Emit that a new game has started
        this.onGameStart.emit(this);
        // Setup tiles
        this.resetTiles();
        // Setup pieces on back rows
        this.resetPieces();
    }
    endTurn(forPlayer) {
        let oldPlayer = forPlayer;
        let newPlayer = (forPlayer == player_type_1.PlayerType.Black ? player_type_1.PlayerType.Red : player_type_1.PlayerType.Black);
        // Set the new player
        this.turnPlayer = newPlayer;
        // Emit that current players turn ended
        this.onPlayerTurnEnd.emit(oldPlayer);
        // Emit that new players turn started
        this.onPlayerTurnStart.emit(new on_player_turn_start_event_args_1.OnPlayerTurnStartEventArgs(newPlayer, this.movablePieces));
    }
    get movablePieces() {
        let possibleMoves = [];
        // Get the current player
        let currentPlayer = this.turnPlayer;
        // Get their current active pieces
        let pieces = this.pieces.filter(p => p.owner == currentPlayer);
        // For each of the current player's pieces
        for (let piece of pieces) {
            // Get its valid moves
            let validMoves = piece.validMoves;
            // And create a movable piece if it has any
            if (validMoves.length > 0) {
                possibleMoves.push(new movable_piece_1.MoveablePiece(piece, validMoves));
            }
        }
        return possibleMoves;
    }
    emulatePlay() {
        return __awaiter(this, void 0, void 0, function* () {
            let dur = 500;
            // Black
            let blackPiece = this.pieces.filter(p => p.id == 'black|1')[0];
            blackPiece.move(new point_1.Point(0, 1));
            yield this.sleep(dur);
            // Red
            let redPiece = this.pieces.filter(p => p.id == 'red|1')[0];
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
}
exports.Game = Game;

},{"../enum/player-type":7,"../events/on-player-turn-start-event-args":9,"./../events/event-emitter":8,"./movable-piece":2,"./piece":3,"./point":4,"./rules":5,"./tile":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveablePiece = void 0;
class MoveablePiece {
    constructor(piece, possiblePositions) {
        this.piece = piece;
        this.possiblePositions = possiblePositions;
    }
}
exports.MoveablePiece = MoveablePiece;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
class Piece {
    constructor(game, index, owner, position) {
        this.game = game;
        this.id = `${owner}|${index}`;
        this.active = true;
        this.owner = owner;
        this.position = position;
        this.height = 1;
    }
    get currentTile() {
        return this.game.tiles.filter(t => t.position.x == this.position.x && t.position.y == this.position.y)[0];
    }
    get validMoves() {
        let currentTile = this.currentTile;
        // If there are any other pieces on this tile higher than it, it's stuck and can't move
        if (currentTile.pieces.some(p => p.height > this.height)) {
            return [];
        }
        // Otherwise, look for adjacent tiles that still exist
        let potentialTiles = currentTile.adjacentTiles;
        // Filter out any that have too many pieces
        let validTiles = potentialTiles.filter(t => t.pieces.length < this.game.rules.maxStackSize);
        return validTiles.map(t => t.position);
    }
    move(newPosition) {
        let sourceTile = this.currentTile;
        let destinationTile = this.game.tiles.filter(t => t.position.x == newPosition.x && t.position.y == newPosition.y)[0];
        // If the intended movement is included in our valid moves, we can move there
        let canMove = this.validMoves.some(vm => vm.x == newPosition.x &&
            vm.y == newPosition.y);
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
exports.Piece = Piece;

},{}],4:[function(require,module,exports){
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
    get adjacentPoints() {
        let x = this.x;
        let y = this.y;
        return [
            new Point(x - 1, y - 1),
            new Point(x, y - 1),
            new Point(x + 1, y - 1),
            new Point(x - 1, y),
            new Point(x + 1, y),
            new Point(x - 1, y + 1),
            new Point(x, y + 1),
            new Point(x + 1, y + 1),
        ];
    }
    toString() {
        return `{${this.x},${this.y}}`;
    }
}
exports.Point = Point;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rules = void 0;
class Rules {
    constructor() {
        this.maxStackSize = 3;
    }
}
exports.Rules = Rules;

},{}],6:[function(require,module,exports){
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
    // Gets adjacent in-play tiles
    get adjacentTiles() {
        // Get all possible 8 directions
        let adjacentPointsAsStrings = this.position.adjacentPoints.map(p => p.toString());
        // Get game tiles that are in play that match those locations
        let adjacentTiles = this.game.tiles.filter(t => t.inPlay
            && adjacentPointsAsStrings.includes(t.position.toString()));
        return adjacentTiles;
    }
    removeFromPlay() {
        this.inPlay = false;
        this.game.onTileRemovedFromPlay.emit(this);
    }
}
exports.Tile = Tile;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerType = void 0;
var PlayerType;
(function (PlayerType) {
    PlayerType["Black"] = "black";
    PlayerType["Red"] = "red";
})(PlayerType || (exports.PlayerType = PlayerType = {}));

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPlayerTurnStartEventArgs = void 0;
class OnPlayerTurnStartEventArgs {
    constructor(player, moveablePieces) {
        this.player = player;
        this.moveablePieces = moveablePieces;
    }
}
exports.OnPlayerTurnStartEventArgs = OnPlayerTurnStartEventArgs;

},{}],10:[function(require,module,exports){
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

},{"./class/game":1,"./renderers/html-renderer":11}],11:[function(require,module,exports){
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
        this.movesHolder = document.querySelector('.board .moves');
        this.turnHint = document.querySelector('.turn-hint');
    }
    bindToGame(game) {
        this.game = game;
        // When a new game starts
        this.game.onGameStart.on((newGame) => {
            // Reset anything we need to
            // Clear any existing elements
            [this.tilesHolder, this.piecesHolder, this.movesHolder].forEach(el => el.innerHTML = '');
        });
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
        this.game.onPieceMoved.on((piece) => {
            // Update it
            this.updatePieceElement(piece);
            // Set as last active so we can keep it on-top of other pieces, visually
            this.setPieceAsLastActive(piece);
        });
        // When a turn starts
        this.game.onPlayerTurnStart.on((args) => {
            // Render the turn hint
            this.turnHint.classList.remove('red');
            this.turnHint.classList.remove('black');
            this.turnHint.classList.add(args.player);
            // Update pieces (their canMove states might have changed)
            // Set all as non-moveable
            for (let piece of this.game.pieces) {
                let pieceElement = this.getPieceElement(piece);
                pieceElement.setAttribute('data-can-move', false.toString());
            }
            for (let moveablePiece of args.moveablePieces) {
                let moveablePieceElement = this.getPieceElement(moveablePiece.piece);
                moveablePieceElement.setAttribute('data-can-move', true.toString());
            }
            // Show possible moves
            // TODO: no, only show these on piece click
            //this.renderPossibleMoves();
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
    renderPossibleMoves() {
        return;
        let movablePieces = this.game.movablePieces;
        // Clear existing move overlays
        this.movesHolder.innerHTML = '';
        // Create new ones for those in movablePieces
        for (let movablePiece of movablePieces) {
            for (let point of movablePiece.possiblePositions) {
                this.movesHolder.appendChild(html_utilities_1.HtmlUtilities.elementFromString(`
						<move data-x="${point.x}" data-y="${point.y}" data-piece-id="${movablePiece.piece.id}" data-owner="${movablePiece.piece.owner}">
						</move>
					`));
            }
        }
    }
}
exports.HtmlRenderer = HtmlRenderer;

},{"../class/game":1,"../utility/html-utilities":12}],12:[function(require,module,exports){
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

},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jbGFzcy9nYW1lLnRzIiwic3JjL3NjcmlwdHMvY2xhc3MvbW92YWJsZS1waWVjZS50cyIsInNyYy9zY3JpcHRzL2NsYXNzL3BpZWNlLnRzIiwic3JjL3NjcmlwdHMvY2xhc3MvcG9pbnQudHMiLCJzcmMvc2NyaXB0cy9jbGFzcy9ydWxlcy50cyIsInNyYy9zY3JpcHRzL2NsYXNzL3RpbGUudHMiLCJzcmMvc2NyaXB0cy9lbnVtL3BsYXllci10eXBlLnRzIiwic3JjL3NjcmlwdHMvZXZlbnRzL2V2ZW50LWVtaXR0ZXIudHMiLCJzcmMvc2NyaXB0cy9ldmVudHMvb24tcGxheWVyLXR1cm4tc3RhcnQtZXZlbnQtYXJncy50cyIsInNyYy9zY3JpcHRzL21haW4udHMiLCJzcmMvc2NyaXB0cy9yZW5kZXJlcnMvaHRtbC1yZW5kZXJlci50cyIsInNyYy9zY3JpcHRzL3V0aWxpdHkvaHRtbC11dGlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7QUNBQSxxREFBaUQ7QUFDakQsbUNBQWdDO0FBQ2hDLG1DQUFnQztBQUNoQyxpQ0FBOEI7QUFDOUIsNkRBQXlEO0FBQ3pELG1EQUFnRDtBQUNoRCxtQ0FBZ0M7QUFDaEMsK0ZBQXVGO0FBRXZGLE1BQWEsSUFBSTtJQUFqQjtRQUVDLHdCQUF3QjtRQUNqQixVQUFLLEdBQVUsSUFBSSxhQUFLLEVBQUUsQ0FBQztRQUVsQyxRQUFRO1FBQ0QsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUNyQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLGVBQVUsR0FBZSx3QkFBVSxDQUFDLEdBQUcsQ0FBQztRQUUvQyxhQUFhO1FBQ0wsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRTFCLFNBQVM7UUFDRixnQkFBVyxHQUF1QixJQUFJLDRCQUFZLEVBQVEsQ0FBQztR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LENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFrQjtRQUNsQixZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU8sbUJBQW1CO1FBQzFCLE9BQU87UUFDUCxJQUFJLGFBQWEsR0FBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFFN0QsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVoQyw2Q0FBNkM7UUFDN0MsS0FBSyxJQUFJLFlBQVksSUFBSSxhQUFhLEVBQUU7WUFDdkMsS0FBSyxJQUFJLEtBQUssSUFBSSxZQUFZLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUMzQiw4QkFBYSxDQUFDLGlCQUFpQixDQUFDO3NCQUNmLEtBQUssQ0FBQyxDQUFDLGFBQWEsS0FBSyxDQUFDLENBQUMsb0JBQW9CLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxpQkFBaUIsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLOztNQUU3SCxDQUFDLENBQ0YsQ0FBQTthQUNEO1NBQ0Q7SUFDRixDQUFDO0NBQ0Q7QUE5SkQsb0NBOEpDOzs7Ozs7QUN0S0QsTUFBc0IsYUFBYTtJQUNsQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBa0I7UUFDMUMsSUFBSSxHQUFHLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckQsR0FBRyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEMsT0FBTyxHQUFHLENBQUMsVUFBMEIsQ0FBQztJQUN2QyxDQUFDO0NBOEJEO0FBbkNELHNDQW1DQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFBsYXllclR5cGUgfSBmcm9tIFwiLi4vZW51bS9wbGF5ZXItdHlwZVwiO1xyXG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gXCIuL3BpZWNlXCI7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vLi4vZXZlbnRzL2V2ZW50LWVtaXR0ZXJcIjtcclxuaW1wb3J0IHsgTW92ZWFibGVQaWVjZSB9IGZyb20gXCIuL21vdmFibGUtcGllY2VcIjtcclxuaW1wb3J0IHsgUnVsZXMgfSBmcm9tIFwiLi9ydWxlc1wiO1xyXG5pbXBvcnQgeyBPblBsYXllclR1cm5TdGFydEV2ZW50QXJncyB9IGZyb20gXCIuLi9ldmVudHMvb24tcGxheWVyLXR1cm4tc3RhcnQtZXZlbnQtYXJnc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG5cclxuXHQvLyBSdWxlcyBhbmQgY29uc3RyYWludHNcclxuXHRwdWJsaWMgcnVsZXM6IFJ1bGVzID0gbmV3IFJ1bGVzKCk7XHJcblxyXG5cdC8vIFN0YXRlXHJcblx0cHVibGljIHBpZWNlczogUGllY2VbXSA9IFtdO1xyXG5cdHB1YmxpYyB0aWxlczogVGlsZVtdID0gW107XHJcblx0cHVibGljIHR1cm5QbGF5ZXI6IFBsYXllclR5cGUgPSBQbGF5ZXJUeXBlLlJlZDtcclxuXHJcblx0Ly8gRGltZW5zaW9uc1xyXG5cdHByaXZhdGUgaGVpZ2h0OiBudW1iZXIgPSA1O1xyXG5cdHByaXZhdGUgd2lkdGg6IG51bWJlciA9IDU7XHJcblxyXG5cdC8vIEV2ZW50c1xyXG5cdHB1YmxpYyBvbkdhbWVTdGFydDogRXZlbnRFbWl0dGVyPEdhbWU+ID0gbmV3IEV2ZW50RW1pdHRlcjxHYW1lPigpO1xyXG5cdHB1YmxpYyBvblBpZWNlQ3JlYXRlZDogRXZlbnRFbWl0dGVyPFBpZWNlPiA9IG5ldyBFdmVudEVtaXR0ZXI8UGllY2U+KCk7XHJcblx0cHVibGljIG9uUGllY2VNb3ZlZDogRXZlbnRFbWl0dGVyPFBpZWNlPiA9IG5ldyBFdmVudEVtaXR0ZXI8UGllY2U+KCk7XHJcblx0cHVibGljIG9uVGlsZUNyZWF0ZWQ6IEV2ZW50RW1pdHRlcjxUaWxlPiA9IG5ldyBFdmVudEVtaXR0ZXI8VGlsZT4oKTtcclxuXHRwdWJsaWMgb25UaWxlUmVtb3ZlZEZyb21QbGF5OiBFdmVudEVtaXR0ZXI8VGlsZT4gPSBuZXcgRXZlbnRFbWl0dGVyPFRpbGU+KCk7XHJcblx0cHVibGljIG9uUGxheWVyVHVyblN0YXJ0OiBFdmVudEVtaXR0ZXI8T25QbGF5ZXJUdXJuU3RhcnRFdmVudEFyZ3M+ID0gbmV3IEV2ZW50RW1pdHRlcjxPblBsYXllclR1cm5TdGFydEV2ZW50QXJncz4oKTtcclxuXHRwdWJsaWMgb25QbGF5ZXJUdXJuRW5kOiBFdmVudEVtaXR0ZXI8UGxheWVyVHlwZT4gPSBuZXcgRXZlbnRFbWl0dGVyPFBsYXllclR5cGU+KCk7XHJcblxyXG5cclxuXHRwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcclxuXHRcdC8vIEVtaXQgdGhhdCBhIG5ldyBnYW1lIGhhcyBzdGFydGVkXHJcblx0XHR0aGlzLm9uR2FtZVN0YXJ0LmVtaXQodGhpcyk7XHJcblxyXG5cdFx0Ly8gU2V0dXAgdGlsZXNcclxuXHRcdHRoaXMucmVzZXRUaWxlcygpO1xyXG5cclxuXHRcdC8vIFNldHVwIHBpZWNlcyBvbiBiYWNrIHJvd3NcclxuXHRcdHRoaXMucmVzZXRQaWVjZXMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBlbmRUdXJuKGZvclBsYXllcjogUGxheWVyVHlwZSk6IHZvaWQge1xyXG5cclxuXHRcdGxldCBvbGRQbGF5ZXI6IFBsYXllclR5cGUgPSBmb3JQbGF5ZXI7XHJcblx0XHRsZXQgbmV3UGxheWVyOiBQbGF5ZXJUeXBlID0gKGZvclBsYXllciA9PSBQbGF5ZXJUeXBlLkJsYWNrID8gUGxheWVyVHlwZS5SZWQgOiBQbGF5ZXJUeXBlLkJsYWNrKTtcclxuXHJcblx0XHQvLyBTZXQgdGhlIG5ldyBwbGF5ZXJcclxuXHRcdHRoaXMudHVyblBsYXllciA9IG5ld1BsYXllcjtcclxuXHJcblx0XHQvLyBFbWl0IHRoYXQgY3VycmVudCBwbGF5ZXJzIHR1cm4gZW5kZWRcclxuXHRcdHRoaXMub25QbGF5ZXJUdXJuRW5kLmVtaXQob2xkUGxheWVyKTtcclxuXHJcblx0XHQvLyBFbWl0IHRoYXQgbmV3IHBsYXllcnMgdHVybiBzdGFydGVkXHJcblx0XHR0aGlzLm9uUGxheWVyVHVyblN0YXJ0LmVtaXQobmV3IE9uUGxheWVyVHVyblN0YXJ0RXZlbnRBcmdzKG5ld1BsYXllciwgdGhpcy5tb3ZhYmxlUGllY2VzKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IG1vdmFibGVQaWVjZXMoKTogTW92ZWFibGVQaWVjZVtdIHtcclxuXHRcdGxldCBwb3NzaWJsZU1vdmVzOiBNb3ZlYWJsZVBpZWNlW10gPSBbXTtcclxuXHJcblx0XHQvLyBHZXQgdGhlIGN1cnJlbnQgcGxheWVyXHJcblx0XHRsZXQgY3VycmVudFBsYXllcjogUGxheWVyVHlwZSA9IHRoaXMudHVyblBsYXllcjtcclxuXHJcblx0XHQvLyBHZXQgdGhlaXIgY3VycmVudCBhY3RpdmUgcGllY2VzXHJcblx0XHRsZXQgcGllY2VzOiBQaWVjZVtdID0gdGhpcy5waWVjZXMuZmlsdGVyKHAgPT4gcC5vd25lciA9PSBjdXJyZW50UGxheWVyKTtcclxuXHJcblx0XHQvLyBGb3IgZWFjaCBvZiB0aGUgY3VycmVudCBwbGF5ZXIncyBwaWVjZXNcclxuXHRcdGZvciAobGV0IHBpZWNlIG9mIHBpZWNlcykge1xyXG5cdFx0XHQvLyBHZXQgaXRzIHZhbGlkIG1vdmVzXHJcblx0XHRcdGxldCB2YWxpZE1vdmVzOiBQb2ludFtdID0gcGllY2UudmFsaWRNb3ZlcztcclxuXHJcblx0XHRcdC8vIEFuZCBjcmVhdGUgYSBtb3ZhYmxlIHBpZWNlIGlmIGl0IGhhcyBhbnlcclxuXHRcdFx0aWYgKHZhbGlkTW92ZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHBvc3NpYmxlTW92ZXMucHVzaChcclxuXHRcdFx0XHRcdG5ldyBNb3ZlYWJsZVBpZWNlKFxyXG5cdFx0XHRcdFx0XHRwaWVjZSxcclxuXHRcdFx0XHRcdFx0dmFsaWRNb3Zlc1xyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcG9zc2libGVNb3ZlcztcclxuXHR9XHJcblxyXG5cclxuXHRzbGVlcCA9IGFzeW5jIChtaWxsaXNlY29uZHM6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtaWxsaXNlY29uZHMpKTtcclxuXHR9O1xyXG5cdHB1YmxpYyBhc3luYyBlbXVsYXRlUGxheSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuXHRcdGxldCBkdXI6IG51bWJlciA9IDUwMDtcclxuXHJcblx0XHQvLyBCbGFja1xyXG5cdFx0bGV0IGJsYWNrUGllY2U6IFBpZWNlID0gdGhpcy5waWVjZXMuZmlsdGVyKHAgPT4gcC5pZCA9PSAnYmxhY2t8MScpWzBdO1xyXG5cdFx0YmxhY2tQaWVjZS5tb3ZlKG5ldyBQb2ludCgwLCAxKSk7XHJcblx0XHRhd2FpdCB0aGlzLnNsZWVwKGR1cik7XHJcblxyXG5cdFx0Ly8gUmVkXHJcblx0XHRsZXQgcmVkUGllY2U6IFBpZWNlID0gdGhpcy5waWVjZXMuZmlsdGVyKHAgPT4gcC5pZCA9PSAncmVkfDEnKVswXTtcclxuXHRcdHJlZFBpZWNlLm1vdmUobmV3IFBvaW50KDEsIDMpKTtcclxuXHRcdGF3YWl0IHRoaXMuc2xlZXAoZHVyKTtcclxuXHJcblx0XHQvLyBCbGFja1xyXG5cdFx0YmxhY2tQaWVjZS5tb3ZlKG5ldyBQb2ludCgwLCAyKSk7XHJcblx0XHRhd2FpdCB0aGlzLnNsZWVwKGR1cik7XHJcblxyXG5cdFx0Ly8gUmVkIHN0YWNrc1xyXG5cdFx0cmVkUGllY2UubW92ZShuZXcgUG9pbnQoMiwgNCkpO1xyXG5cdFx0YXdhaXQgdGhpcy5zbGVlcChkdXIpO1xyXG5cclxuXHRcdC8vIEJsYWNrIGdvZXMgb24gdG9wXHJcblx0XHRibGFja1BpZWNlLm1vdmUobmV3IFBvaW50KDEsIDIpKTtcclxuXHRcdGF3YWl0IHRoaXMuc2xlZXAoZHVyKTtcclxuXHRcdGJsYWNrUGllY2UubW92ZShuZXcgUG9pbnQoMiwgMykpO1xyXG5cdFx0YXdhaXQgdGhpcy5zbGVlcChkdXIpO1xyXG5cdFx0YmxhY2tQaWVjZS5tb3ZlKG5ldyBQb2ludCgyLCA0KSk7XHJcblx0XHRhd2FpdCB0aGlzLnNsZWVwKGR1cik7XHJcblxyXG5cdFx0YmxhY2tQaWVjZS5tb3ZlKG5ldyBQb2ludCgzLCAzKSk7XHJcblx0XHRhd2FpdCB0aGlzLnNsZWVwKGR1cik7XHJcblx0fVxyXG5cclxuXHQvLyBSZXNldCBzdGF0ZSBvZiBhbGwgdGlsZXNcclxuXHRwcml2YXRlIHJlc2V0VGlsZXMoKTogdm9pZCB7XHJcblx0XHR0aGlzLnRpbGVzID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgeDogbnVtYmVyID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xyXG5cdFx0XHRmb3IgKGxldCB5OiBudW1iZXIgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xyXG5cdFx0XHRcdGxldCBuZXdUaWxlID0gbmV3IFRpbGUodGhpcywgbmV3IFBvaW50KHgsIHkpKTtcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZVRpbGUobmV3VGlsZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFJlc2V0cyBhbGwgcGllY2UgcG9zaXRpb25zXHJcblx0cHJpdmF0ZSByZXNldFBpZWNlcygpOiB2b2lkIHtcclxuXHRcdHRoaXMucGllY2VzID0gW107XHJcblxyXG5cdFx0Zm9yIChsZXQgeDogbnVtYmVyID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xyXG5cclxuXHRcdFx0Ly8gQmxhY2sgb24gdG9wIHJvd1xyXG5cdFx0XHRsZXQgbmV3QmxhY2s6IFBpZWNlID0gbmV3IFBpZWNlKFxyXG5cdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0eCArIDEsIC8vIHggcG9zIGFzIElEXHJcblx0XHRcdFx0UGxheWVyVHlwZS5CbGFjayxcclxuXHRcdFx0XHRuZXcgUG9pbnQoeCwgMClcclxuXHRcdFx0KTtcclxuXHRcdFx0dGhpcy5jcmVhdGVQaWVjZShuZXdCbGFjayk7XHJcblxyXG5cdFx0XHQvLyBSZWQgb24gYm90dG9tXHJcblx0XHRcdGxldCBuZXdSZWQ6IFBpZWNlID0gbmV3IFBpZWNlKFxyXG5cdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0eCArIDEsIC8vIHggcG9zIGFzIElEXHJcblx0XHRcdFx0UGxheWVyVHlwZS5SZWQsXHJcblx0XHRcdFx0bmV3IFBvaW50KHgsIHRoaXMuaGVpZ2h0IC0gMSlcclxuXHRcdFx0KTtcclxuXHRcdFx0dGhpcy5jcmVhdGVQaWVjZShuZXdSZWQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gVGlsZSBoZWxwZXJzXHJcblx0cHJpdmF0ZSBjcmVhdGVUaWxlKHRpbGU6IFRpbGUpOiB2b2lkIHtcclxuXHRcdHRoaXMudGlsZXMucHVzaCh0aWxlKTtcclxuXHRcdHRoaXMub25UaWxlQ3JlYXRlZC5lbWl0KHRpbGUpO1xyXG5cdH1cclxuXHJcblx0Ly8gUGllY2UgaGVscGVyc1xyXG5cdHByaXZhdGUgY3JlYXRlUGllY2UocGllY2U6IFBpZWNlKTogdm9pZCB7XHJcblx0XHR0aGlzLnBpZWNlcy5wdXNoKHBpZWNlKTtcclxuXHRcdHRoaXMub25QaWVjZUNyZWF0ZWQuZW1pdChwaWVjZSk7XHJcblx0fVxyXG5cclxufSIsImltcG9ydCB7IFBpZWNlIH0gZnJvbSBcIi4vcGllY2VcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vdmVhYmxlUGllY2Uge1xyXG5cdHBpZWNlOiBQaWVjZTtcclxuXHRwb3NzaWJsZVBvc2l0aW9uczogUG9pbnRbXTtcclxuXHJcblx0Y29uc3RydWN0b3IocGllY2U6IFBpZWNlLCBwb3NzaWJsZVBvc2l0aW9uczogUG9pbnRbXSkge1xyXG5cdFx0dGhpcy5waWVjZSA9IHBpZWNlO1xyXG5cdFx0dGhpcy5wb3NzaWJsZVBvc2l0aW9ucyA9IHBvc3NpYmxlUG9zaXRpb25zO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XHJcbmltcG9ydCB7IFBsYXllclR5cGUgfSBmcm9tIFwiLi4vZW51bS9wbGF5ZXItdHlwZVwiO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGllY2Uge1xyXG5cdGlkOiBzdHJpbmc7XHJcblx0YWN0aXZlOiBib29sZWFuO1xyXG5cdGdhbWU6IEdhbWU7XHJcblx0b3duZXI6IFBsYXllclR5cGU7XHJcblx0cG9zaXRpb246IFBvaW50O1xyXG5cdGhlaWdodDogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBpbmRleDogbnVtYmVyLCBvd25lcjogUGxheWVyVHlwZSwgcG9zaXRpb246IFBvaW50KSB7XHJcblx0XHR0aGlzLmdhbWUgPSBnYW1lO1xyXG5cdFx0dGhpcy5pZCA9IGAke293bmVyfXwke2luZGV4fWA7XHJcblx0XHR0aGlzLmFjdGl2ZSA9IHRydWU7XHJcblx0XHR0aGlzLm93bmVyID0gb3duZXI7XHJcblx0XHR0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcblx0XHR0aGlzLmhlaWdodCA9IDE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGN1cnJlbnRUaWxlKCk6IFRpbGUge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2FtZS50aWxlcy5maWx0ZXIodCA9PiB0LnBvc2l0aW9uLnggPT0gdGhpcy5wb3NpdGlvbi54ICYmIHQucG9zaXRpb24ueSA9PSB0aGlzLnBvc2l0aW9uLnkpWzBdO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2YWxpZE1vdmVzKCk6IFBvaW50W10ge1xyXG5cdFx0bGV0IGN1cnJlbnRUaWxlOiBUaWxlID0gdGhpcy5jdXJyZW50VGlsZTtcclxuXHJcblx0XHQvLyBJZiB0aGVyZSBhcmUgYW55IG90aGVyIHBpZWNlcyBvbiB0aGlzIHRpbGUgaGlnaGVyIHRoYW4gaXQsIGl0J3Mgc3R1Y2sgYW5kIGNhbid0IG1vdmVcclxuXHRcdGlmIChjdXJyZW50VGlsZS5waWVjZXMuc29tZShwID0+IHAuaGVpZ2h0ID4gdGhpcy5oZWlnaHQpKSB7XHJcblx0XHRcdHJldHVybiBbXTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBPdGhlcndpc2UsIGxvb2sgZm9yIGFkamFjZW50IHRpbGVzIHRoYXQgc3RpbGwgZXhpc3RcclxuXHRcdGxldCBwb3RlbnRpYWxUaWxlczogVGlsZVtdID0gY3VycmVudFRpbGUuYWRqYWNlbnRUaWxlcztcclxuXHJcblx0XHQvLyBGaWx0ZXIgb3V0IGFueSB0aGF0IGhhdmUgdG9vIG1hbnkgcGllY2VzXHJcblx0XHRsZXQgdmFsaWRUaWxlczogVGlsZVtdID0gcG90ZW50aWFsVGlsZXMuZmlsdGVyKHQgPT5cclxuXHRcdFx0dC5waWVjZXMubGVuZ3RoIDwgdGhpcy5nYW1lLnJ1bGVzLm1heFN0YWNrU2l6ZVxyXG5cdFx0KTtcclxuXHJcblx0XHRyZXR1cm4gdmFsaWRUaWxlcy5tYXAodCA9PiB0LnBvc2l0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBtb3ZlKG5ld1Bvc2l0aW9uOiBQb2ludCk6IHZvaWQge1xyXG5cdFx0bGV0IHNvdXJjZVRpbGU6IFRpbGUgPSB0aGlzLmN1cnJlbnRUaWxlO1xyXG5cdFx0bGV0IGRlc3RpbmF0aW9uVGlsZTogVGlsZSA9IHRoaXMuZ2FtZS50aWxlcy5maWx0ZXIodCA9PiB0LnBvc2l0aW9uLnggPT0gbmV3UG9zaXRpb24ueCAmJiB0LnBvc2l0aW9uLnkgPT0gbmV3UG9zaXRpb24ueSlbMF07XHJcblxyXG5cclxuXHRcdC8vIElmIHRoZSBpbnRlbmRlZCBtb3ZlbWVudCBpcyBpbmNsdWRlZCBpbiBvdXIgdmFsaWQgbW92ZXMsIHdlIGNhbiBtb3ZlIHRoZXJlXHJcblx0XHRsZXQgY2FuTW92ZTogYm9vbGVhbiA9IHRoaXMudmFsaWRNb3Zlcy5zb21lKHZtID0+XHJcblx0XHRcdHZtLnggPT0gbmV3UG9zaXRpb24ueCAmJlxyXG5cdFx0XHR2bS55ID09IG5ld1Bvc2l0aW9uLnlcclxuXHRcdCk7XHJcblxyXG5cdFx0aWYgKGNhbk1vdmUpIHtcclxuXHRcdFx0Ly8gU2V0IGhlaWdodFxyXG5cdFx0XHR0aGlzLmhlaWdodCA9IGRlc3RpbmF0aW9uVGlsZS5waWVjZXMubGVuZ3RoICsgMTtcclxuXHJcblx0XHRcdC8vIFNldCB0aGUgbmV3IHBvc2l0aW9uXHJcblx0XHRcdHRoaXMucG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcclxuXHJcblx0XHRcdC8vIEhhdmUgdGlsZSBjaGVjayBpZiBpdCdzIGVtcHR5IG5vdywgYW5kIGlmIHNvLCByZW1vdmUgaXRcclxuXHJcblx0XHRcdGlmIChzb3VyY2VUaWxlLmlzRW1wdHkpIHtcclxuXHRcdFx0XHRzb3VyY2VUaWxlLnJlbW92ZUZyb21QbGF5KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFRPRE86IGNoZWNrIGZvciB1bmlxdWUgY29udGlndW91cyAoaW5jLiBkaWFnKSBpc2xhbmRzXHJcblx0XHRcdC8vIEZvciBlYWNoIGlzbGFuZFxyXG5cdFx0XHQvLyBJZiB0aGVyZSdzIG5vIHBpZWNlcyBvbiB0aGUgaXNsYW5kLCByZW1vdmUgYWxsIHRpbGVzIGluIGl0IGZyb20gcGxheVxyXG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgcGllY2VzLCBjaGVjayBpZiBhbnkgY2FuIG1ha2UgYSBtb3ZlXHJcblx0XHRcdC8vIElmIGl0IGNhbiwgZmluZVxyXG5cdFx0XHQvLyBJZiBOT05FIGNhbiwgdGhlbiByZW1vdmUgdGhlIHRpbGVzIEFORCBwaWVjZXMgZnJvbSBwbGF5IFxyXG5cclxuXHRcdFx0Ly8gRW1pdCBldmVudFxyXG5cdFx0XHR0aGlzLmdhbWUub25QaWVjZU1vdmVkLmVtaXQodGhpcyk7XHJcblxyXG5cdFx0XHQvLyBFbmQgdHVyblxyXG5cdFx0XHR0aGlzLmdhbWUuZW5kVHVybih0aGlzLm93bmVyKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgUG9pbnQge1xyXG5cdHg6IG51bWJlcjtcclxuXHR5OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGQob3RoZXJQb2ludDogUG9pbnQpOiBQb2ludCB7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KHRoaXMueCArIG90aGVyUG9pbnQueCwgdGhpcy55ICsgb3RoZXJQb2ludC55KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgYWRqYWNlbnRQb2ludHMoKTogUG9pbnRbXSB7XHJcblx0XHRsZXQgeCA9IHRoaXMueDtcclxuXHRcdGxldCB5ID0gdGhpcy55O1xyXG5cclxuXHRcdHJldHVybiBbXHJcblx0XHRcdG5ldyBQb2ludCh4IC0gMSwgeSAtIDEpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeCwgeSAtIDEpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeCArIDEsIHkgLSAxKSxcclxuXHRcdFx0bmV3IFBvaW50KHggLSAxLCB5KSxcclxuXHRcdFx0bmV3IFBvaW50KHggKyAxLCB5KSxcclxuXHRcdFx0bmV3IFBvaW50KHggLSAxLCB5ICsgMSksXHJcblx0XHRcdG5ldyBQb2ludCh4LCB5ICsgMSksXHJcblx0XHRcdG5ldyBQb2ludCh4ICsgMSwgeSArIDEpLFxyXG5cdFx0XTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGB7JHt0aGlzLnh9LCR7dGhpcy55fX1gO1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBSdWxlcyB7XHJcblx0bWF4U3RhY2tTaXplOiBudW1iZXIgPSAzO1xyXG59IiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuaW1wb3J0IHsgUGllY2UgfSBmcm9tIFwiLi9waWVjZVwiO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGlsZSB7XHJcblx0Z2FtZTogR2FtZTtcclxuXHRwb3NpdGlvbjogUG9pbnQ7XHJcblx0aW5QbGF5OiBib29sZWFuO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwb3NpdGlvbjogUG9pbnQpIHtcclxuXHRcdHRoaXMuZ2FtZSA9IGdhbWU7XHJcblx0XHR0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcblxyXG5cdFx0Ly8gRGVmYXVsdCB0byBpbi1wbGF5XHJcblx0XHR0aGlzLmluUGxheSA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHBpZWNlcygpOiBQaWVjZVtdIHtcclxuXHRcdHJldHVybiB0aGlzLmdhbWUucGllY2VzLmZpbHRlcihwID0+IHAucG9zaXRpb24ueCA9PSB0aGlzLnBvc2l0aW9uLnggJiYgcC5wb3NpdGlvbi55ID09IHRoaXMucG9zaXRpb24ueSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5waWVjZXMubGVuZ3RoID09IDA7XHJcblx0fVxyXG5cclxuXHQvLyBHZXRzIGFkamFjZW50IGluLXBsYXkgdGlsZXNcclxuXHRwdWJsaWMgZ2V0IGFkamFjZW50VGlsZXMoKTogVGlsZVtdIHtcclxuXHRcdC8vIEdldCBhbGwgcG9zc2libGUgOCBkaXJlY3Rpb25zXHJcblx0XHRsZXQgYWRqYWNlbnRQb2ludHNBc1N0cmluZ3M6IHN0cmluZ1tdID0gdGhpcy5wb3NpdGlvbi5hZGphY2VudFBvaW50cy5tYXAocCA9PiBwLnRvU3RyaW5nKCkpO1xyXG5cclxuXHRcdC8vIEdldCBnYW1lIHRpbGVzIHRoYXQgYXJlIGluIHBsYXkgdGhhdCBtYXRjaCB0aG9zZSBsb2NhdGlvbnNcclxuXHRcdGxldCBhZGphY2VudFRpbGVzID0gdGhpcy5nYW1lLnRpbGVzLmZpbHRlcih0ID0+XHJcblx0XHRcdHQuaW5QbGF5XHJcblx0XHRcdCYmIGFkamFjZW50UG9pbnRzQXNTdHJpbmdzLmluY2x1ZGVzKHQucG9zaXRpb24udG9TdHJpbmcoKSlcclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIGFkamFjZW50VGlsZXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVtb3ZlRnJvbVBsYXkoKTogdm9pZCB7XHJcblx0XHR0aGlzLmluUGxheSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5nYW1lLm9uVGlsZVJlbW92ZWRGcm9tUGxheS5lbWl0KHRoaXMpO1xyXG5cdH1cclxufSIsImV4cG9ydCBlbnVtIFBsYXllclR5cGUge1xyXG5cdEJsYWNrID0gJ2JsYWNrJyxcclxuXHRSZWQgPSAncmVkJ1xyXG59IiwiZXhwb3J0IGludGVyZmFjZSBMaXN0ZW5lcjxUPiB7XHJcblx0KGV2ZW50OiBUKTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpc3Bvc2FibGUge1xyXG5cdGRpc3Bvc2UoKTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50RW1pdHRlcjxUPiB7XHJcblx0cHJpdmF0ZSBsaXN0ZW5lcnM6IExpc3RlbmVyPFQ+W10gPSBbXTtcclxuXHRwcml2YXRlIGxpc3RlbmVyc09uY2VyOiBMaXN0ZW5lcjxUPltdID0gW107XHJcblxyXG5cdG9uID0gKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPik6IERpc3Bvc2FibGUgPT4ge1xyXG5cdFx0dGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkaXNwb3NlOiAoKSA9PiB0aGlzLm9mZihsaXN0ZW5lcilcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRvbmNlID0gKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPik6IHZvaWQgPT4ge1xyXG5cdFx0dGhpcy5saXN0ZW5lcnNPbmNlci5wdXNoKGxpc3RlbmVyKTtcclxuXHR9XHJcblxyXG5cdG9mZiA9IChsaXN0ZW5lcjogTGlzdGVuZXI8VD4pID0+IHtcclxuXHRcdHZhciBjYWxsYmFja0luZGV4ID0gdGhpcy5saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XHJcblx0XHRpZiAoY2FsbGJhY2tJbmRleCA+IC0xKSB0aGlzLmxpc3RlbmVycy5zcGxpY2UoY2FsbGJhY2tJbmRleCwgMSk7XHJcblx0fVxyXG5cclxuXHRlbWl0ID0gKGV2ZW50OiBUKSA9PiB7XHJcblx0XHQvKiogVXBkYXRlIGFueSBnZW5lcmFsIGxpc3RlbmVycyAqL1xyXG5cdFx0dGhpcy5saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IGxpc3RlbmVyKGV2ZW50KSk7XHJcblxyXG5cdFx0LyoqIENsZWFyIHRoZSBgb25jZWAgcXVldWUgKi9cclxuXHRcdGlmICh0aGlzLmxpc3RlbmVyc09uY2VyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Y29uc3QgdG9DYWxsID0gdGhpcy5saXN0ZW5lcnNPbmNlcjtcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnNPbmNlciA9IFtdO1xyXG5cdFx0XHR0b0NhbGwuZm9yRWFjaCgobGlzdGVuZXIpID0+IGxpc3RlbmVyKGV2ZW50KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwaXBlID0gKHRlOiBFdmVudEVtaXR0ZXI8VD4pOiBEaXNwb3NhYmxlID0+IHtcclxuXHRcdHJldHVybiB0aGlzLm9uKChlKSA9PiB0ZS5lbWl0KGUpKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBNb3ZlYWJsZVBpZWNlIH0gZnJvbSBcIi4uL2NsYXNzL21vdmFibGUtcGllY2VcIjtcclxuaW1wb3J0IHsgUGxheWVyVHlwZSB9IGZyb20gXCIuLi9lbnVtL3BsYXllci10eXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT25QbGF5ZXJUdXJuU3RhcnRFdmVudEFyZ3Mge1xyXG5cdHBsYXllcjogUGxheWVyVHlwZTtcclxuXHRtb3ZlYWJsZVBpZWNlczogTW92ZWFibGVQaWVjZVtdO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllclR5cGUsIG1vdmVhYmxlUGllY2VzOiBNb3ZlYWJsZVBpZWNlW10pIHtcclxuXHRcdHRoaXMucGxheWVyID0gcGxheWVyO1xyXG5cdFx0dGhpcy5tb3ZlYWJsZVBpZWNlcyA9IG1vdmVhYmxlUGllY2VzO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9jbGFzcy9nYW1lXCI7XHJcbmltcG9ydCB7IEh0bWxSZW5kZXJlciB9IGZyb20gXCIuL3JlbmRlcmVycy9odG1sLXJlbmRlcmVyXCI7XHJcblxyXG5cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuXHQvLyBDcmVhdGUgb3VyIGdhbWUgYW5kIHJlbmRlcmVyXHJcblx0bGV0IHJlbmRlcmVyOiBIdG1sUmVuZGVyZXIgPSBuZXcgSHRtbFJlbmRlcmVyKCk7XHJcblx0bGV0IGdhbWU6IEdhbWUgPSBuZXcgR2FtZSgpO1xyXG5cclxuXHQvLyBTZXQgdXAgdGhlIHJlbmRlcmVyIHRvIGxpc3RlbiBmb3IgZ2FtZSBldmVudHNcclxuXHRyZW5kZXJlci5iaW5kVG9HYW1lKGdhbWUpO1xyXG5cclxuXHQvLyBJbml0aWFsaXplIHRoZSBnYW1lXHJcblx0Z2FtZS5pbml0aWFsaXplKCk7XHJcblxyXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0Z2FtZS5lbXVsYXRlUGxheSgpO1xyXG5cdH0sIDEwMDApO1xyXG59KTsiLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2NsYXNzL2dhbWVcIjtcclxuaW1wb3J0IHsgTW92ZWFibGVQaWVjZSB9IGZyb20gXCIuLi9jbGFzcy9tb3ZhYmxlLXBpZWNlXCI7XHJcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSBcIi4uL2NsYXNzL3BpZWNlXCI7XHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi4vY2xhc3MvdGlsZVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJUeXBlIH0gZnJvbSBcIi4uL2VudW0vcGxheWVyLXR5cGVcIjtcclxuaW1wb3J0IHsgT25QbGF5ZXJUdXJuU3RhcnRFdmVudEFyZ3MgfSBmcm9tIFwiLi4vZXZlbnRzL29uLXBsYXllci10dXJuLXN0YXJ0LWV2ZW50LWFyZ3NcIjtcclxuaW1wb3J0IHsgSHRtbFV0aWxpdGllcyB9IGZyb20gXCIuLi91dGlsaXR5L2h0bWwtdXRpbGl0aWVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSHRtbFJlbmRlcmVyIHtcclxuXHRnYW1lOiBHYW1lO1xyXG5cclxuXHR0aWxlc0hvbGRlcjogSFRNTEVsZW1lbnQ7XHJcblx0cGllY2VzSG9sZGVyOiBIVE1MRWxlbWVudDtcclxuXHRtb3Zlc0hvbGRlcjogSFRNTEVsZW1lbnQ7XHJcblxyXG5cdHR1cm5IaW50OiBIVE1MRWxlbWVudDtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmdhbWUgPSBuZXcgR2FtZSgpO1xyXG5cclxuXHRcdHRoaXMudGlsZXNIb2xkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQgLnRpbGVzJykhO1xyXG5cdFx0dGhpcy5waWVjZXNIb2xkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQgLnBpZWNlcycpITtcclxuXHRcdHRoaXMubW92ZXNIb2xkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQgLm1vdmVzJykhO1xyXG5cclxuXHRcdHRoaXMudHVybkhpbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybi1oaW50JykhO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGJpbmRUb0dhbWUoZ2FtZTogR2FtZSk6IHZvaWQge1xyXG5cdFx0dGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcblx0XHQvLyBXaGVuIGEgbmV3IGdhbWUgc3RhcnRzXHJcblx0XHR0aGlzLmdhbWUub25HYW1lU3RhcnQub24oKG5ld0dhbWU6IEdhbWUpID0+IHtcclxuXHRcdFx0Ly8gUmVzZXQgYW55dGhpbmcgd2UgbmVlZCB0b1xyXG5cclxuXHRcdFx0Ly8gQ2xlYXIgYW55IGV4aXN0aW5nIGVsZW1lbnRzXHJcblx0XHRcdFt0aGlzLnRpbGVzSG9sZGVyLCB0aGlzLnBpZWNlc0hvbGRlciwgdGhpcy5tb3Zlc0hvbGRlcl0uZm9yRWFjaChlbCA9PiBlbC5pbm5lckhUTUwgPSAnJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBXaGVuIGEgdGlsZSBpcyBjcmVhdGVkXHJcblx0XHR0aGlzLmdhbWUub25UaWxlQ3JlYXRlZC5vbigodGlsZTogVGlsZSkgPT4ge1xyXG5cdFx0XHRsZXQgbmV3VGlsZTogSFRNTEVsZW1lbnQgPSBIdG1sVXRpbGl0aWVzLmVsZW1lbnRGcm9tU3RyaW5nKGBcclxuXHRcdFx0XHQ8dGlsZSBkYXRhLXg9XCIke3RpbGUucG9zaXRpb24ueH1cIiBkYXRhLXk9XCIke3RpbGUucG9zaXRpb24ueX1cIiBkYXRhLWluLXBsYXk9XCIke3RpbGUuaW5QbGF5fVwiPlxyXG5cdFx0XHRcdDwvdGlsZT5cclxuXHRcdFx0YCk7XHJcblxyXG5cdFx0XHR0aGlzLnRpbGVzSG9sZGVyLmFwcGVuZENoaWxkKG5ld1RpbGUpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gV2hlbiBhIHRpbGUgaXMgcmVtb3ZlZCBmcm9tIHBsYXlcclxuXHRcdHRoaXMuZ2FtZS5vblRpbGVSZW1vdmVkRnJvbVBsYXkub24oKHRpbGU6IFRpbGUpID0+IHtcclxuXHRcdFx0dGhpcy51cGRhdGVUaWxlRWxlbWVudCh0aWxlKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFdoZW4gYSBwaWVjZSBpcyBjcmVhdGVkXHJcblx0XHR0aGlzLmdhbWUub25QaWVjZUNyZWF0ZWQub24oKHBpZWNlOiBQaWVjZSkgPT4ge1xyXG5cdFx0XHRsZXQgbmV3UGllY2U6IEhUTUxFbGVtZW50ID0gSHRtbFV0aWxpdGllcy5lbGVtZW50RnJvbVN0cmluZyhgXHJcblx0XHRcdFx0PHBpZWNlIFxyXG5cdFx0XHRcdFx0ZGF0YS1pZD1cIiR7cGllY2UuaWR9XCIgXHJcblx0XHRcdFx0XHRkYXRhLXg9XCIke3BpZWNlLnBvc2l0aW9uLnh9XCIgXHJcblx0XHRcdFx0XHRkYXRhLXk9XCIke3BpZWNlLnBvc2l0aW9uLnl9XCIgXHJcblx0XHRcdFx0XHRkYXRhLW93bmVyPVwiJHtwaWVjZS5vd25lcn1cIiBcclxuXHRcdFx0XHRcdGRhdGEtaGVpZ2h0PVwiJHtwaWVjZS5oZWlnaHR9XCJcclxuXHRcdFx0XHRcdGRhdGEtY2FuLW1vdmU9XCJmYWxzZVwiXHRcclxuXHRcdFx0XHQ+XHJcblx0XHRcdFx0PC9waWVjZT5cclxuXHRcdFx0YCk7XHJcblxyXG5cdFx0XHR0aGlzLnBpZWNlc0hvbGRlci5hcHBlbmRDaGlsZChuZXdQaWVjZSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBXaGVuIGEgcGllY2UgbW92ZXNcclxuXHRcdHRoaXMuZ2FtZS5vblBpZWNlTW92ZWQub24oKHBpZWNlOiBQaWVjZSkgPT4ge1xyXG5cdFx0XHQvLyBVcGRhdGUgaXRcclxuXHRcdFx0dGhpcy51cGRhdGVQaWVjZUVsZW1lbnQocGllY2UpO1xyXG5cclxuXHRcdFx0Ly8gU2V0IGFzIGxhc3QgYWN0aXZlIHNvIHdlIGNhbiBrZWVwIGl0IG9uLXRvcCBvZiBvdGhlciBwaWVjZXMsIHZpc3VhbGx5XHJcblx0XHRcdHRoaXMuc2V0UGllY2VBc0xhc3RBY3RpdmUocGllY2UpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gV2hlbiBhIHR1cm4gc3RhcnRzXHJcblx0XHR0aGlzLmdhbWUub25QbGF5ZXJUdXJuU3RhcnQub24oKGFyZ3M6IE9uUGxheWVyVHVyblN0YXJ0RXZlbnRBcmdzKSA9PiB7XHJcblx0XHRcdC8vIFJlbmRlciB0aGUgdHVybiBoaW50XHJcblx0XHRcdHRoaXMudHVybkhpbnQuY2xhc3NMaXN0LnJlbW92ZSgncmVkJyk7XHJcblx0XHRcdHRoaXMudHVybkhpbnQuY2xhc3NMaXN0LnJlbW92ZSgnYmxhY2snKTtcclxuXHRcdFx0dGhpcy50dXJuSGludC5jbGFzc0xpc3QuYWRkKGFyZ3MucGxheWVyKTtcclxuXHJcblx0XHRcdC8vIFVwZGF0ZSBwaWVjZXMgKHRoZWlyIGNhbk1vdmUgc3RhdGVzIG1pZ2h0IGhhdmUgY2hhbmdlZClcclxuXHRcdFx0Ly8gU2V0IGFsbCBhcyBub24tbW92ZWFibGVcclxuXHRcdFx0Zm9yIChsZXQgcGllY2Ugb2YgdGhpcy5nYW1lLnBpZWNlcykge1xyXG5cdFx0XHRcdGxldCBwaWVjZUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5nZXRQaWVjZUVsZW1lbnQocGllY2UpITtcclxuXHRcdFx0XHRwaWVjZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWNhbi1tb3ZlJywgZmFsc2UudG9TdHJpbmcoKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAobGV0IG1vdmVhYmxlUGllY2Ugb2YgYXJncy5tb3ZlYWJsZVBpZWNlcykge1xyXG5cdFx0XHRcdGxldCBtb3ZlYWJsZVBpZWNlRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLmdldFBpZWNlRWxlbWVudChtb3ZlYWJsZVBpZWNlLnBpZWNlKSE7XHJcblx0XHRcdFx0bW92ZWFibGVQaWVjZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWNhbi1tb3ZlJywgdHJ1ZS50b1N0cmluZygpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gU2hvdyBwb3NzaWJsZSBtb3Zlc1xyXG5cdFx0XHQvLyBUT0RPOiBubywgb25seSBzaG93IHRoZXNlIG9uIHBpZWNlIGNsaWNrXHJcblx0XHRcdC8vdGhpcy5yZW5kZXJQb3NzaWJsZU1vdmVzKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0UGllY2VFbGVtZW50KHBpZWNlOiBQaWVjZSk6IEhUTUxFbGVtZW50IHwgbnVsbCB7XHJcblx0XHRsZXQgZm91bmRFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSB0aGlzLnBpZWNlc0hvbGRlci5xdWVyeVNlbGVjdG9yKGBwaWVjZVtkYXRhLWlkPVwiJHtwaWVjZS5pZH1cIl1bZGF0YS1vd25lcj1cIiR7cGllY2Uub3duZXJ9XCJdYCk7XHJcblx0XHRyZXR1cm4gZm91bmRFbGVtZW50O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRUaWxlRWxlbWVudCh0aWxlOiBUaWxlKTogSFRNTEVsZW1lbnQgfCBudWxsIHtcclxuXHRcdGxldCBmb3VuZEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IHRoaXMudGlsZXNIb2xkZXIucXVlcnlTZWxlY3RvcihgdGlsZVtkYXRhLXg9XCIke3RpbGUucG9zaXRpb24ueH1cIl1bZGF0YS15PVwiJHt0aWxlLnBvc2l0aW9uLnl9XCJdYCk7XHJcblx0XHRyZXR1cm4gZm91bmRFbGVtZW50O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSB1cGRhdGVQaWVjZUVsZW1lbnQocGllY2U6IFBpZWNlKTogdm9pZCB7XHJcblx0XHQvLyBGaW5kIHRoZSBwaWVjZVxyXG5cdFx0bGV0IHBpZWNlRWxlbWVudCA9IHRoaXMuZ2V0UGllY2VFbGVtZW50KHBpZWNlKTtcclxuXHRcdGlmIChwaWVjZUVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIFVwZGF0ZSBpdFxyXG5cdFx0cGllY2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS14JywgcGllY2UucG9zaXRpb24ueC50b1N0cmluZygpKTtcclxuXHRcdHBpZWNlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEteScsIHBpZWNlLnBvc2l0aW9uLnkudG9TdHJpbmcoKSk7XHJcblx0XHRwaWVjZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWhlaWdodCcsIHBpZWNlLmhlaWdodC50b1N0cmluZygpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgdXBkYXRlVGlsZUVsZW1lbnQodGlsZTogVGlsZSk6IHZvaWQge1xyXG5cdFx0Ly8gRmluZCB0aGUgdGlsZVxyXG5cdFx0bGV0IHRpbGVFbGVtZW50ID0gdGhpcy5nZXRUaWxlRWxlbWVudCh0aWxlKTtcclxuXHRcdGlmICh0aWxlRWxlbWVudCA9PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gVXBkYXRlIGl0XHJcblx0XHR0aWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW4tcGxheScsIHRpbGUuaW5QbGF5LnRvU3RyaW5nKCkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBzZXRQaWVjZUFzTGFzdEFjdGl2ZShwaWVjZTogUGllY2UpOiB2b2lkIHtcclxuXHRcdGxldCBwaWVjZUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5nZXRQaWVjZUVsZW1lbnQocGllY2UpITtcclxuXHRcdGxldCBsYXN0QWN0aXZlQ2xhc3M6IHN0cmluZyA9ICdsYXN0LWFjdGl2ZS1waWVjZSc7XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIGZyb20gYWxsIGVsZW1lbnRzXHJcblx0XHR0aGlzLnBpZWNlc0hvbGRlci5xdWVyeVNlbGVjdG9yQWxsKCdwaWVjZScpLmZvckVhY2gocCA9PiB7XHJcblx0XHRcdHAuY2xhc3NMaXN0LnJlbW92ZShsYXN0QWN0aXZlQ2xhc3MpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gQWRkIHRvIHRoaXMgb25lXHJcblx0XHRwaWVjZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChsYXN0QWN0aXZlQ2xhc3MpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByZW5kZXJQb3NzaWJsZU1vdmVzKCk6IHZvaWQge1xyXG5cdFx0cmV0dXJuO1xyXG5cdFx0bGV0IG1vdmFibGVQaWVjZXM6IE1vdmVhYmxlUGllY2VbXSA9IHRoaXMuZ2FtZS5tb3ZhYmxlUGllY2VzO1xyXG5cclxuXHRcdC8vIENsZWFyIGV4aXN0aW5nIG1vdmUgb3ZlcmxheXNcclxuXHRcdHRoaXMubW92ZXNIb2xkZXIuaW5uZXJIVE1MID0gJyc7XHJcblxyXG5cdFx0Ly8gQ3JlYXRlIG5ldyBvbmVzIGZvciB0aG9zZSBpbiBtb3ZhYmxlUGllY2VzXHJcblx0XHRmb3IgKGxldCBtb3ZhYmxlUGllY2Ugb2YgbW92YWJsZVBpZWNlcykge1xyXG5cdFx0XHRmb3IgKGxldCBwb2ludCBvZiBtb3ZhYmxlUGllY2UucG9zc2libGVQb3NpdGlvbnMpIHtcclxuXHRcdFx0XHR0aGlzLm1vdmVzSG9sZGVyLmFwcGVuZENoaWxkKFxyXG5cdFx0XHRcdFx0SHRtbFV0aWxpdGllcy5lbGVtZW50RnJvbVN0cmluZyhgXHJcblx0XHRcdFx0XHRcdDxtb3ZlIGRhdGEteD1cIiR7cG9pbnQueH1cIiBkYXRhLXk9XCIke3BvaW50Lnl9XCIgZGF0YS1waWVjZS1pZD1cIiR7bW92YWJsZVBpZWNlLnBpZWNlLmlkfVwiIGRhdGEtb3duZXI9XCIke21vdmFibGVQaWVjZS5waWVjZS5vd25lcn1cIj5cclxuXHRcdFx0XHRcdFx0PC9tb3ZlPlxyXG5cdFx0XHRcdFx0YClcclxuXHRcdFx0XHQpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgSHRtbFV0aWxpdGllcyB7XHJcblx0c3RhdGljIGVsZW1lbnRGcm9tU3RyaW5nKGh0bWxTdHJpbmc6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuXHRcdGxldCBkaXY6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRkaXYuaW5uZXJIVE1MID0gaHRtbFN0cmluZy50cmltKCk7XHJcblx0XHRyZXR1cm4gZGl2LmZpcnN0Q2hpbGQhIGFzIEhUTUxFbGVtZW50O1xyXG5cdH1cclxuXHJcblx0Ly8gc3RhdGljIHJlbW92ZUNsYXNzRnJvbUVsZW1lbnRzKHF1ZXJ5U2VsZWN0b3I6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHQvLyBcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnlTZWxlY3RvcikuZm9yRWFjaCgoZWw6IEVsZW1lbnQpID0+IHtcclxuXHQvLyBcdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG5cdC8vIFx0fSk7XHJcblx0Ly8gfVxyXG5cclxuXHQvLyBzdGF0aWMgYWRkQ2xhc3NGcm9tRWxlbWVudHMocXVlcnlTZWxlY3Rvcjogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZyk6IHZvaWQge1xyXG5cdC8vIFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeVNlbGVjdG9yKS5mb3JFYWNoKChlbDogRWxlbWVudCkgPT4ge1xyXG5cdC8vIFx0XHRlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcblx0Ly8gXHR9KTtcclxuXHQvLyB9XHJcblxyXG5cdC8vIHN0YXRpYyBsaXZlQmluZChldmVudFR5cGUsIGVsZW1lbnRRdWVyeVNlbGVjdG9yLCBjYikge1xyXG5cdC8vIFx0Ly9kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XHJcblx0Ly8gXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnQgPT4ge1xyXG5cdC8vIFx0XHRsZXQgZWwgPSBldmVudC50YXJnZXQuY2xvc2VzdChlbGVtZW50UXVlcnlTZWxlY3Rvcik7XHJcblx0Ly8gXHRcdGlmIChlbCkge1xyXG5cdC8vIFx0XHRcdGNiLmNhbGwodGhpcywgZWwsIGV2ZW50KTtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fSk7XHJcblx0Ly8gfVxyXG5cclxuXHQvLyBzdGF0aWMgc2hha2UoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcblx0Ly8gXHRlbC5jbGFzc0xpc3QuYWRkKCdzaGFrZScpO1xyXG5cdC8vIFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0Ly8gXHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NoYWtlJyk7XHJcblx0Ly8gXHR9LCAzNTApO1xyXG5cdC8vIH1cclxufSJdfQ==
