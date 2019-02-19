import { Comparable } from './../../main/comparable.interface';
export class Coord implements Comparable<Coord> {
	constructor(private x: number = 0, private y: number = 0) {}

	toString(): string {
		return JSON.stringify(this);
	}

	/**
	 * compareTo Example
	 * This is just a little draft for the test.
	 * I do not recomment doing this as it does not take overflow into account
	 * Might be fine with bigints
	 */
	compareTo(other: Coord): number {
		return this.y === other.y ? this.x - other.x : this.y - other.y;
	}
}
