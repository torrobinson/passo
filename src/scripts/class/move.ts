import { Point } from "./point";

export class Move {
	toPosition: Point;
	isGoalpostWin: boolean;

	constructor(toPosition: Point, isGoalpostWin: boolean) {
		this.toPosition = toPosition;
		this.isGoalpostWin = isGoalpostWin;
	}
}