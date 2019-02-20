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
	 * Returns the first element.
	 * Complexity: O(1)
	 */
	first(): SimpleNode {
		if (this.l) return this.l.first();
		else return this;
	}

	/**
	 * Returns the last element.
	 * Complexity: O(1)
	 */
	last(): SimpleNode {
		if (this.r) return this.r.last();
		else return this;
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

	/**
	 * Rebalances the tree below the node if the height differences are too big
	 */
	rebalance(): SimpleNode {
		if (this.l) this.l = this.l.rebalance();
		if (this.r) this.r = this.r.rebalance();
		const lh = this.l ? this.l.h : 0;
		const rh = this.r ? this.r.h : 0;
		if (lh > rh + 1) {
			if ((this.l && this.l.l && this.l.l.h) || 0 > (this.l && this.l.r && this.l.r.h) || 0) {
				return this.rrotate();
			} else return this.lrrotate();
		} else if (rh > lh + 1) {
			if ((this.r && this.r.r && this.r.r.h) || 0 > (this.r && this.r.l && this.r.l.h) || 0) {
				return this.lrotate();
			} else return this.rlrotate();
		} else return this;
	}

	/**
	 * Performs a right-left rotation
	 */
	private rlrotate(): SimpleNode {
		this.r = this.r.rrotate();
		return this.lrotate();
	}

	/**
	 * Performs a left-right rotation
	 */
	private lrrotate(): SimpleNode {
		this.l = this.l.lrotate();
		return this.rrotate();
	}

	/**
	 * Performs a right rotation on the tree
	 */
	private rrotate(): SimpleNode {
		const root: SimpleNode = this.l;
		this.l = root.r;
		root.r = this;
		this.updateHeight();
		if (this.r) this.r.updateHeight();
		root.updateHeight();
		return root;
	}

	/**
	 * Performs a right rotation on the tree
	 */
	private lrotate(): SimpleNode {
		const root: SimpleNode = this.r;
		this.r = root.l;
		root.l = this;
		this.updateHeight();
		if (this.l) this.l.updateHeight();
		root.updateHeight();
		return root;
	}
}
