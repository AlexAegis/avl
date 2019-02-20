import { Convertable } from './convertable.interface';
import { Comparable } from './comparable.interface';
export class SimpleNode {
	l: SimpleNode;
	r: SimpleNode;
	h: number;
	v: number;
	constructor(...init: number[]) {
		for (const k of init) this.set(k);
	}

	/**
	 * Calculates the height of the node. A leafs (node without either a left or a right node) height is
	 */
	updateHeight(): void {
		this.h = 1 + Math.max(this.l ? this.l.h : 0, this.r ? this.r.h : 0);
	}

	/**
	 * Searches for a Node containing a key
	 */
	search(v: number): number {
		if (this.v !== undefined && this.v === v) {
			return this.v;
		} else if (v < this.v) {
			if (this.l) return this.l.search(v);
			else return undefined;
		} else if (v > this.v) {
			if (this.r) return this.r.search(v);
			else return undefined;
		}
	}

	/**
	 * Sets the node to a specific value. Inserts the node in an order respecting manner
	 */
	set(v: number): boolean {
		let overwrite = false;
		if (this.v === undefined || this.v === v) {
			this.v = v;
			overwrite = true;
		} else if (v < this.v) {
			if (this.l) return this.l.set(v);
			else this.l = new SimpleNode(v);
		} else if (v > this.v) {
			if (this.r) return this.r.set(v);
			else this.r = new SimpleNode(v);
		}
		this.updateHeight();
		return overwrite;
	}

	/**
	 * Generator function
	 * that returns all the values of the nodes below and this in an ascending order
	 */
	*[Symbol.iterator](): IterableIterator<number> {
		if (this.l) yield* this.l;
		if (this.v !== undefined) yield this.v;
		if (this.r) yield* this.r;
	}
}
