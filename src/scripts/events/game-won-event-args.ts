import { PlayerType } from "../enum/player-type";
import { WinCondition } from "../enum/win-condition";

export class GameWonEventArgs {
	winningPlayer: PlayerType;
	winCondition: WinCondition

	constructor(winningPlayer: PlayerType, winCondition: WinCondition) {
		this.winningPlayer = winningPlayer;
		this.winCondition = winCondition;
	}
}