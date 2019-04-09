export class Basic {
	public n: number;
	constructor(n?: number) {
		this.n = n;
	}

	toString(): string {
		return `{type: ${typeof this} n: ${this.n}}`;
	}
}
