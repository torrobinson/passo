import { Piece } from "./piece";
import { Point } from "./point";

export class MoveablePiece {
	piece: Piece;
	possiblePositions: Point[];

	constructor(piece: Piece, possiblePositions: Point[]) {
		this.piece = piece;
		this.possiblePositions = possiblePositions;
	}
}