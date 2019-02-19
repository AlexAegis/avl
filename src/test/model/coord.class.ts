import { Convertable } from './../../main/convertable.interface';
export class Coord {
	constructor(private x: number = 0, private y: number = 0) {}

	toString(): string {
		return this.x + ',' + this.y;
	}
}
