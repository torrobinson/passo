"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(otherPoint) {
        return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
    }
    get isInBounds() {
        return this.x >= 0 && this.x <= 7
            && this.y >= 0 && this.y <= 7;
    }
    toString() {
        return `{${this.x},${this.y}}`;
    }
}
exports.Point = Point;
