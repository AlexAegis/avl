export class BasicComparable {
	public n: number;
	public constructor(n?: number) {
		this.n = n;
	}

	public compareTo(other: BasicComparable): number {
		return this.n - other.n;
	}

	public toString(): string {
		return `{type: ${typeof this} n: ${this.n}}`;
	}
}
