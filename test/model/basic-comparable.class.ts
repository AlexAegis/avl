import 'reflect-metadata';
import { jsonObject, jsonMember } from 'typedjson';
import { Comparable } from '../../src/interface/comparable.interface';

@jsonObject
export class BasicComparable {
	@jsonMember
	public n: number;
	public constructor(n?: number) {
		this.n = n;
	}

	public compareTo(other: BasicComparable): number {
		// console.log(`this.n: ${this.n} other.n: ${other.n}`); // another.n: ${another.n}`);
		return this.n - other.n;
	}

	public toString(): string {
		return `{type: ${typeof this} n: ${this.n}}`;
	}
}
