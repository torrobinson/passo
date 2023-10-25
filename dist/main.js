(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var Game = /** @class */ (function () {
    function Game() {
        this.pieces = [];
        this.initialize();
    }
    Game.prototype.initialize = function () {
        // Reset everything
        this.resetTiles();
        this.resetPieces();
    };
    // Resets all piece positions
    Game.prototype.resetPieces = function () {
    };
    // Reset state of all tiles
    Game.prototype.resetTiles = function () {
    };
    return Game;
}());
exports.Game = Game;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./class/game");
var game;
document.addEventListener("DOMContentLoaded", function () {
    game = new game_1.Game();
});

},{"./class/game":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9jbGFzcy9nYW1lLnRzIiwic3JjL3NjcmlwdHMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0VBO0lBSUM7UUFGTyxXQUFNLEdBQVksRUFBRSxDQUFDO1FBRzNCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRU0seUJBQVUsR0FBakI7UUFDQyxtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsNkJBQTZCO0lBQ3JCLDBCQUFXLEdBQW5CO0lBRUEsQ0FBQztJQUVELDJCQUEyQjtJQUNuQix5QkFBVSxHQUFsQjtJQUVBLENBQUM7SUFFRixXQUFDO0FBQUQsQ0F4QkEsQUF3QkMsSUFBQTtBQXhCWSxvQkFBSTs7Ozs7QUNGakIscUNBQW9DO0FBRXBDLElBQUksSUFBVSxDQUFDO0FBRWYsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO0lBRTdDLElBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO0FBRW5CLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgUGllY2UgfSBmcm9tIFwiLi9waWVjZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG5cclxuXHRwdWJsaWMgcGllY2VzOiBQaWVjZVtdID0gW107XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcclxuXHRcdC8vIFJlc2V0IGV2ZXJ5dGhpbmdcclxuXHRcdHRoaXMucmVzZXRUaWxlcygpO1xyXG5cdFx0dGhpcy5yZXNldFBpZWNlcygpO1xyXG5cdH1cclxuXHJcblx0Ly8gUmVzZXRzIGFsbCBwaWVjZSBwb3NpdGlvbnNcclxuXHRwcml2YXRlIHJlc2V0UGllY2VzKCk6IHZvaWQge1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIFJlc2V0IHN0YXRlIG9mIGFsbCB0aWxlc1xyXG5cdHByaXZhdGUgcmVzZXRUaWxlcygpOiB2b2lkIHtcclxuXHJcblx0fVxyXG5cclxufSIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9jbGFzcy9nYW1lXCI7XHJcblxyXG5sZXQgZ2FtZTogR2FtZTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuXHJcblx0Z2FtZSA9IG5ldyBHYW1lKCk7XHJcblxyXG59KTsiXX0=
