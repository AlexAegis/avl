
export class Basic {
	constructor(public n: number) {}

	toString(): string {
		return `{type: ${typeof this} n: ${this.n}}`;
	}
}
