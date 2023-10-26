import { MoveablePiece } from "../class/movable-piece";
import { PlayerType } from "../enum/player-type";

export class OnPlayerTurnStartEventArgs {
	player: PlayerType;
	moveablePieces: MoveablePiece[];

	constructor(player: PlayerType, moveablePieces: MoveablePiece[]) {
		this.player = player;
		this.moveablePieces = moveablePieces;
	}
}