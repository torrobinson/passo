export class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public add(otherPoint: Point): Point {
		return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
	}

	public get adjacentPoints(): Point[] {
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

	public toString(): string {
		return `{${this.x},${this.y}}`;
	}
}