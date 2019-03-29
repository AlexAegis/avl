import 'reflect-metadata';

import { jsonObject, jsonMember } from 'typedjson';
import { Comparable } from '../../src/interface/comparable.interface';

@jsonObject
export class Basic {
	@jsonMember
	public n: number;
	constructor(n?: number) {
		this.n = n;
	}

	toString(): string {
		return `{type: ${typeof this} n: ${this.n}}`;
	}
}
