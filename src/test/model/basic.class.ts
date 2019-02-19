export class Basic {
	constructor(protected n: number) {}

	toString(): string {
		return `{type: ${typeof this} n: ${this.n}}`;
	}
}
