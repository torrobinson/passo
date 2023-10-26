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
        // Actors
        this.pieces = [];
        this.tiles = [];
        // Dimensions
        this.height = 5;
        this.width = 5;
        // Events
        this.onPieceCreated = new event_emitter_1.EventEmitter();
        this.onPieceMoved = new event_emitter_1.EventEmitter();
        this.onTileCreated = new event_emitter_1.EventEmitter();
        this.onTileRemovedFromPlay = new event_emitter_1.EventEmitter();
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
