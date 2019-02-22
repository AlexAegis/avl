export class CompareError extends Error {
	constructor() {
		super('Cannot compare, no sufficient comparing method. Either use a Comparable or supply a comparator');
	}
}
