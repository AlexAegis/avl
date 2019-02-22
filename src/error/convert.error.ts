export class ConvertError extends Error {
	constructor() {
		super('Cannot convert, no sufficient conversion method. Either use a Convertable or supply a converter');
	}
}
