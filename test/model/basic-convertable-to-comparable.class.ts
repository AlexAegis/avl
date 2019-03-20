import { Convertable } from './../../src/interface/convertable.interface';
import { Coord } from './coord.class';
export class BasicConvertableToComparable implements Convertable<Coord> {
	constructor(private coord: Coord) {}
	convertTo(): Coord {
		return this.coord;
	}
}
