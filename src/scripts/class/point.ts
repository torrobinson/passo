export class Point {
	x: number;
	y: number;
	hasPiece: boolean;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public add(otherPoint: Point): Point {
		return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
	}

	get isInBounds(): boolean {
		return this.x >= 0 && this.x <= 7
			&& this.y >= 0 && this.y <= 7
	}

	public toString(): string {
		return `{${this.x},${this.y}}`;
	}
}