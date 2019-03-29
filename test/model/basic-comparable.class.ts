import 'reflect-metadata';
import { jsonObject, jsonMember } from 'typedjson';
import { Comparable } from '../../src/interface/comparable.interface';

// @jsonObject
export class BasicComparable {
	// @jsonMember
	public n: number;
	public constructor(n?: number) {
		this.n = n;
	}

	public compareTo(other: BasicComparable): number {
		// console.log(`this.n: ${this !== undefined ? this.n : 'undef'} other.n: ${other ? other.n : 'undef'}`); // another.n: ${another.n}`);
		return this.n - other.n;
	}

	public toString(): string {
		return `{type: ${typeof this} n: ${this.n}}`;
	}
}
