(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var player_type_1 = require("../enum/player-type");
var piece_1 = require("./piece");
var point_1 = require("./point");
var tile_1 = require("./tile");
var event_emitter_1 = require("./../events/event-emitter");
var Game = /** @class */ (function () {
    function Game() {
        // Actors
        this.pieces = [];
        this.tiles = [];
        // Dimensions
        this.height = 5;
        this.width = 5;
        // Events
        this.onPieceCreated = new event_emitter_1.EventEmitter();
        this.onTileCreated = new event_emitter_1.EventEmitter();
    }
    Game.prototype.initialize = function () {
        // Reset everything
        // Setup tiles
        this.resetTiles();
        // Setup pieces on back rows
        this.resetPieces();
    };
    // Reset state of all tiles
    Game.prototype.resetTiles = function () {
        this.tiles = [];
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var newTile = new tile_1.Tile(this, new point_1.Point(x, y));
                this.tiles.push(newTile);
                this.onTileCreated.emit(newTile);
            }
        }
    };
    // Resets all piece positions
    Game.prototype.resetPieces = function () {
        this.pieces = [];
        for (var x = 0; x < this.width; x++) {
            // Black on top row
            var newBlack = new piece_1.Piece(this, player_type_1.PlayerType.Black, new point_1.Point(x, 0));
            this.pieces.push(newBlack);
            this.onPieceCreated.emit(newBlack);
            // Red on bottom
            var newRed = new piece_1.Piece(this, player_type_1.PlayerType.Black, new point_1.Point(x, this.height - 1));
            this.pieces.push(newRed);
            this.onPieceCreated.emit(newRed);
        }
    };
    return Game;
}());
exports.Game = Game;

},{"../enum/player-type":5,"./../events/event-emitter":6,"./piece":2,"./point":3,"./tile":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
var Piece = /** @class */ (function () {
    function Piece(game, owner, position) {
        this.game = game;
        this.owner = owner;
        this.position = position;
    }
    return Piece;
}());
exports.Piece = Piece;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (otherPoint) {
        return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
    };
    Object.defineProperty(Point.prototype, "isInBounds", {
        get: function () {
            return this.x >= 0 && this.x <= 7
                && this.y >= 0 && this.y <= 7;
        },
        enumerable: false,
        configurable: true
    });
    Point.prototype.toString = function () {
        return "{".concat(this.x, ",").concat(this.y, "}");
    };
    return Point;
}());
exports.Point = Point;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
var Tile = /** @class */ (function () {
    function Tile(game, position) {
        this.game = game;
        this.position = position;
        // Default to in-play
        this.inPlay = true;
    }
    return Tile;
}());
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
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        var _this = this;
        this.listeners = [];
        this.listenersOncer = [];
        this.on = function (listener) {
            _this.listeners.push(listener);
            return {
                dispose: function () { return _this.off(listener); }
            };
        };
        this.once = function (listener) {
            _this.listenersOncer.push(listener);
        };
        this.off = function (listener) {
            var callbackIndex = _this.listeners.indexOf(listener);
            if (callbackIndex > -1)
                _this.listeners.splice(callbackIndex, 1);
        };
        this.emit = function (event) {
            /** Update any general listeners */
            _this.listeners.forEach(function (listener) { return listener(event); });
            /** Clear the `once` queue */
            if (_this.listenersOncer.length > 0) {
                var toCall = _this.listenersOncer;
                _this.listenersOncer = [];
                toCall.forEach(function (listener) { return listener(event); });
            }
        };
        this.pipe = function (te) {
            return _this.on(function (e) { return te.emit(e); });
        };
    }
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./class/game");
var html_renderer_1 = require("./renderers/html-renderer");
var renderer = new html_renderer_1.HtmlRenderer();
var game = new game_1.Game();
document.addEventListener("DOMContentLoaded", function () {
    renderer.bindToGame(game);
    game.initialize();
});

},{"./class/game":1,"./renderers/html-renderer":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlRenderer = void 0;
var HtmlRenderer = /** @class */ (function () {
    function HtmlRenderer() {
    }
    HtmlRenderer.prototype.bindToGame = function (game) {
        this.game = game;
        // When a tile is created
        this.game.onTileCreated.on(function (tile) {
            console.log("Tile created @ " + tile.position);
        });
        // When a piece is created
        this.game.onPieceCreated.on(function (piece) {
            console.log("Piece created @ " + piece.position);
        });
    };
    return HtmlRenderer;
}());
exports.HtmlRenderer = HtmlRenderer;

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jbGFzcy9nYW1lLnRzIiwic3JjL3NjcmlwdHMvY2xhc3MvcGllY2UudHMiLCJzcmMvc2NyaXB0cy9jbGFzcy9wb2ludC50cyIsInNyYy9zY3JpcHRzL2NsYXNzL3RpbGUudHMiLCJzcmMvc2NyaXB0cy9lbnVtL3BsYXllci10eXBlLnRzIiwic3JjL3NjcmlwdHMvZXZlbnRzL2V2ZW50LWVtaXR0ZXIudHMiLCJzcmMvc2NyaXB0cy9tYWluLnRzIiwic3JjL3NjcmlwdHMvcmVuZGVyZXJzL2h0bWwtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxtREFBaUQ7QUFDakQsaUNBQWdDO0FBQ2hDLGlDQUFnQztBQUNoQywrQkFBOEI7QUFDOUIsMkRBQXlEO0FBRXpEO0lBQUE7UUFFQyxTQUFTO1FBQ0YsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUNyQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBRTFCLGFBQWE7UUFDTCxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLFVBQUssR0FBVyxDQUFDLENBQUM7UUFFMUIsU0FBUztRQUNGLG1CQUFjLEdBQXdCLElBQUksNEJBQVksRUFBUyxDQUFDO1FBQ2hFLGtCQUFhLEdBQXVCLElBQUksNEJBQVksRUFBUSxDQUFDO0lBbURyRSxDQUFDO0lBakRPLHlCQUFVLEdBQWpCO1FBQ0MsbUJBQW1CO1FBRW5CLGNBQWM7UUFDZCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFbEIsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsMkJBQTJCO0lBQ25CLHlCQUFVLEdBQWxCO1FBQ0MsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFaEIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUs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QUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxVQUFDLElBQVU7WUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFFSCwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLFVBQUMsS0FBWTtZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVKLENBQUM7SUFDRixtQkFBQztBQUFELENBakJBLEFBaUJDLElBQUE7QUFqQlksb0NBQVkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBQbGF5ZXJUeXBlIH0gZnJvbSBcIi4uL2VudW0vcGxheWVyLXR5cGVcIjtcclxuaW1wb3J0IHsgUGllY2UgfSBmcm9tIFwiLi9waWVjZVwiO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XHJcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gXCIuLy4uL2V2ZW50cy9ldmVudC1lbWl0dGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcblxyXG5cdC8vIEFjdG9yc1xyXG5cdHB1YmxpYyBwaWVjZXM6IFBpZWNlW10gPSBbXTtcclxuXHRwdWJsaWMgdGlsZXM6IFRpbGVbXSA9IFtdO1xyXG5cclxuXHQvLyBEaW1lbnNpb25zXHJcblx0cHJpdmF0ZSBoZWlnaHQ6IG51bWJlciA9IDU7XHJcblx0cHJpdmF0ZSB3aWR0aDogbnVtYmVyID0gNTtcclxuXHJcblx0Ly8gRXZlbnRzXHJcblx0cHVibGljIG9uUGllY2VDcmVhdGVkOiBFdmVudEVtaXR0ZXI8UGllY2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxQaWVjZT4oKTtcclxuXHRwdWJsaWMgb25UaWxlQ3JlYXRlZDogRXZlbnRFbWl0dGVyPFRpbGU+ID0gbmV3IEV2ZW50RW1pdHRlcjxUaWxlPigpO1xyXG5cclxuXHRwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcclxuXHRcdC8vIFJlc2V0IGV2ZXJ5dGhpbmdcclxuXHJcblx0XHQvLyBTZXR1cCB0aWxlc1xyXG5cdFx0dGhpcy5yZXNldFRpbGVzKCk7XHJcblxyXG5cdFx0Ly8gU2V0dXAgcGllY2VzIG9uIGJhY2sgcm93c1xyXG5cdFx0dGhpcy5yZXNldFBpZWNlcygpO1xyXG5cdH1cclxuXHJcblx0Ly8gUmVzZXQgc3RhdGUgb2YgYWxsIHRpbGVzXHJcblx0cHJpdmF0ZSByZXNldFRpbGVzKCk6IHZvaWQge1xyXG5cdFx0dGhpcy50aWxlcyA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IHg6IG51bWJlciA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcclxuXHRcdFx0Zm9yIChsZXQgeTogbnVtYmVyID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcclxuXHRcdFx0XHRsZXQgbmV3VGlsZSA9IG5ldyBUaWxlKHRoaXMsIG5ldyBQb2ludCh4LCB5KSk7XHJcblx0XHRcdFx0dGhpcy50aWxlcy5wdXNoKG5ld1RpbGUpO1xyXG5cdFx0XHRcdHRoaXMub25UaWxlQ3JlYXRlZC5lbWl0KG5ld1RpbGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBSZXNldHMgYWxsIHBpZWNlIHBvc2l0aW9uc1xyXG5cdHByaXZhdGUgcmVzZXRQaWVjZXMoKTogdm9pZCB7XHJcblx0XHR0aGlzLnBpZWNlcyA9IFtdO1xyXG5cclxuXHRcdGZvciAobGV0IHg6IG51bWJlciA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcclxuXHJcblx0XHRcdC8vIEJsYWNrIG9uIHRvcCByb3dcclxuXHRcdFx0bGV0IG5ld0JsYWNrOiBQaWVjZSA9IG5ldyBQaWVjZShcclxuXHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdFBsYXllclR5cGUuQmxhY2ssXHJcblx0XHRcdFx0bmV3IFBvaW50KHgsIDApXHJcblx0XHRcdCk7XHJcblx0XHRcdHRoaXMucGllY2VzLnB1c2gobmV3QmxhY2spO1xyXG5cdFx0XHR0aGlzLm9uUGllY2VDcmVhdGVkLmVtaXQobmV3QmxhY2spO1xyXG5cclxuXHRcdFx0Ly8gUmVkIG9uIGJvdHRvbVxyXG5cdFx0XHRsZXQgbmV3UmVkOiBQaWVjZSA9IG5ldyBQaWVjZShcclxuXHRcdFx0XHR0aGlzLFxyXG5cdFx0XHRcdFBsYXllclR5cGUuQmxhY2ssXHJcblx0XHRcdFx0bmV3IFBvaW50KHgsIHRoaXMuaGVpZ2h0IC0gMSlcclxuXHRcdFx0KTtcclxuXHRcdFx0dGhpcy5waWVjZXMucHVzaChuZXdSZWQpO1xyXG5cdFx0XHR0aGlzLm9uUGllY2VDcmVhdGVkLmVtaXQobmV3UmVkKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59IiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuaW1wb3J0IHsgUGxheWVyVHlwZSB9IGZyb20gXCIuLi9lbnVtL3BsYXllci10eXBlXCI7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQaWVjZSB7XHJcblx0Z2FtZTogR2FtZTtcclxuXHRvd25lcjogUGxheWVyVHlwZTtcclxuXHRwb3NpdGlvbjogUG9pbnQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIG93bmVyOiBQbGF5ZXJUeXBlLCBwb3NpdGlvbjogUG9pbnQpIHtcclxuXHRcdHRoaXMuZ2FtZSA9IGdhbWU7XHJcblx0XHR0aGlzLm93bmVyID0gb3duZXI7XHJcblx0XHR0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuXHR4OiBudW1iZXI7XHJcblx0eTogbnVtYmVyO1xyXG5cdGhhc1BpZWNlOiBib29sZWFuO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkKG90aGVyUG9pbnQ6IFBvaW50KTogUG9pbnQge1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludCh0aGlzLnggKyBvdGhlclBvaW50LngsIHRoaXMueSArIG90aGVyUG9pbnQueSk7XHJcblx0fVxyXG5cclxuXHRnZXQgaXNJbkJvdW5kcygpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB0aGlzLnggPj0gMCAmJiB0aGlzLnggPD0gN1xyXG5cdFx0XHQmJiB0aGlzLnkgPj0gMCAmJiB0aGlzLnkgPD0gN1xyXG5cdH1cclxuXHJcblx0cHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gYHske3RoaXMueH0sJHt0aGlzLnl9fWA7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRpbGUge1xyXG5cdGdhbWU6IEdhbWU7XHJcblx0cG9zaXRpb246IFBvaW50O1xyXG5cdGluUGxheTogYm9vbGVhbjtcclxuXHJcblx0Y29uc3RydWN0b3IoZ2FtZTogR2FtZSwgcG9zaXRpb246IFBvaW50KSB7XHJcblx0XHR0aGlzLmdhbWUgPSBnYW1lO1xyXG5cdFx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cclxuXHRcdC8vIERlZmF1bHQgdG8gaW4tcGxheVxyXG5cdFx0dGhpcy5pblBsYXkgPSB0cnVlO1xyXG5cdH1cclxufSIsImV4cG9ydCBlbnVtIFBsYXllclR5cGUge1xyXG5cdEJsYWNrID0gJ2JsYWNrJyxcclxuXHRSZWQgPSAncmVkJ1xyXG59IiwiZXhwb3J0IGludGVyZmFjZSBMaXN0ZW5lcjxUPiB7XHJcblx0KGV2ZW50OiBUKTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpc3Bvc2FibGUge1xyXG5cdGRpc3Bvc2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50RW1pdHRlcjxUPiB7XHJcblx0cHJpdmF0ZSBsaXN0ZW5lcnM6IExpc3RlbmVyPFQ+W10gPSBbXTtcclxuXHRwcml2YXRlIGxpc3RlbmVyc09uY2VyOiBMaXN0ZW5lcjxUPltdID0gW107XHJcblxyXG5cdG9uID0gKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPik6IERpc3Bvc2FibGUgPT4ge1xyXG5cdFx0dGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkaXNwb3NlOiAoKSA9PiB0aGlzLm9mZihsaXN0ZW5lcilcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRvbmNlID0gKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPik6IHZvaWQgPT4ge1xyXG5cdFx0dGhpcy5saXN0ZW5lcnNPbmNlci5wdXNoKGxpc3RlbmVyKTtcclxuXHR9XHJcblxyXG5cdG9mZiA9IChsaXN0ZW5lcjogTGlzdGVuZXI8VD4pID0+IHtcclxuXHRcdHZhciBjYWxsYmFja0luZGV4ID0gdGhpcy5saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XHJcblx0XHRpZiAoY2FsbGJhY2tJbmRleCA+IC0xKSB0aGlzLmxpc3RlbmVycy5zcGxpY2UoY2FsbGJhY2tJbmRleCwgMSk7XHJcblx0fVxyXG5cclxuXHRlbWl0ID0gKGV2ZW50OiBUKSA9PiB7XHJcblx0XHQvKiogVXBkYXRlIGFueSBnZW5lcmFsIGxpc3RlbmVycyAqL1xyXG5cdFx0dGhpcy5saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IGxpc3RlbmVyKGV2ZW50KSk7XHJcblxyXG5cdFx0LyoqIENsZWFyIHRoZSBgb25jZWAgcXVldWUgKi9cclxuXHRcdGlmICh0aGlzLmxpc3RlbmVyc09uY2VyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Y29uc3QgdG9DYWxsID0gdGhpcy5saXN0ZW5lcnNPbmNlcjtcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnNPbmNlciA9IFtdO1xyXG5cdFx0XHR0b0NhbGwuZm9yRWFjaCgobGlzdGVuZXIpID0+IGxpc3RlbmVyKGV2ZW50KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwaXBlID0gKHRlOiBFdmVudEVtaXR0ZXI8VD4pOiBEaXNwb3NhYmxlID0+IHtcclxuXHRcdHJldHVybiB0aGlzLm9uKChlKSA9PiB0ZS5lbWl0KGUpKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vY2xhc3MvZ2FtZVwiO1xyXG5pbXBvcnQgeyBIdG1sUmVuZGVyZXIgfSBmcm9tIFwiLi9yZW5kZXJlcnMvaHRtbC1yZW5kZXJlclwiO1xyXG5cclxubGV0IHJlbmRlcmVyOiBIdG1sUmVuZGVyZXIgPSBuZXcgSHRtbFJlbmRlcmVyKCk7XHJcbmxldCBnYW1lOiBHYW1lID0gbmV3IEdhbWUoKTtcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XHJcblx0cmVuZGVyZXIuYmluZFRvR2FtZShnYW1lKTtcclxuXHRnYW1lLmluaXRpYWxpemUoKTtcclxuXHJcbn0pOyIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vY2xhc3MvZ2FtZVwiO1xyXG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gXCIuLi9jbGFzcy9waWVjZVwiO1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4uL2NsYXNzL3RpbGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBIdG1sUmVuZGVyZXIge1xyXG5cdGdhbWU6IEdhbWU7XHJcblxyXG5cdHB1YmxpYyBiaW5kVG9HYW1lKGdhbWU6IEdhbWUpOiB2b2lkIHtcclxuXHRcdHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG5cdFx0Ly8gV2hlbiBhIHRpbGUgaXMgY3JlYXRlZFxyXG5cdFx0dGhpcy5nYW1lLm9uVGlsZUNyZWF0ZWQub24oKHRpbGU6IFRpbGUpID0+IHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFRpbGUgY3JlYXRlZCBAIGAgKyB0aWxlLnBvc2l0aW9uKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFdoZW4gYSBwaWVjZSBpcyBjcmVhdGVkXHJcblx0XHR0aGlzLmdhbWUub25QaWVjZUNyZWF0ZWQub24oKHBpZWNlOiBQaWVjZSkgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgUGllY2UgY3JlYXRlZCBAIGAgKyBwaWVjZS5wb3NpdGlvbik7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG59Il19
