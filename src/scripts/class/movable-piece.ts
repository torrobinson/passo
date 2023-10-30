import { Move } from "./move";
import { Piece } from "./piece";
export class MoveablePiece {
	piece: Piece;
	possibleMoves: Move[];

	constructor(piece: Piece, possibleMoves: Move[]) {
		this.piece = piece;
		this.possibleMoves = possibleMoves;
	}
}