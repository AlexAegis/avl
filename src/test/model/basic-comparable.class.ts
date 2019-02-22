import { Comparable } from '../../main/comparable.interface';

export class BasicComparable implements Comparable<BasicComparable> {
	constructor(public n: number) {}

	compareTo(other: BasicComparable): number {
		return this.n - other.n;
	}

	toString(): string {
		return `{type: ${typeof this} n: ${this.n}}`;
	}
}
