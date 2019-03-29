/**
 * This produces unique numbers for every string.
 * Since there are 222 different characters for each letter, the value of it must be raised one of 222's powers.
 * The numbers can get quite large.
 */
export function hashString(s: string): number {
	return (
		s &&
		[...s]
			.filter(n => n !== undefined)
			.reduce((acc, next, i, array) => (acc += next.charCodeAt(0) * Math.pow(222, array.length - i - 1)), 0)
	);
}

export function hashOrReturn(s: string | number): number {
	if (typeof s === 'number') {
		return s as number;
	} else {
		hashString(s);
	}
}
