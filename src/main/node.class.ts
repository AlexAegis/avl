import { Convertable } from './convertable.interface';
import { Comparable } from './comparable.interface';
export class Node<
	V extends number | string | Convertable<K> | any = number | string,
	K extends number | string | V | Comparable<K> = number | string
> {
	l: Node<V, K>;
	r: Node<V, K>;
	h: number;
	k: K;
	v: V;
	constructor(...init: { k: K; v: V }[]) {
		for (const { k, v } of init) this.set(k, v);
	}

	/**
	 * Returns the first element.
	 * Complexity: O(1)
	 */
	first(): Node<V, K> {
		if (this.l) return this.l.first();
		else return this;
	}

	/**
	 * Returns the last element.
	 * Complexity: O(1)
	 */
	last(): Node<V, K> {
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
	search(k: K, comparator?: (a: K, b: K) => number): V {
		if ((k as Comparable<K>).compareTo) {
			comparator = (k as Comparable<K>).compareTo;
		}
		if (this.k && ((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) === 0 : this.k === k)) {
			return this.v as V;
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) < 0 : k < this.k) {
			if (this.l) return this.l.search(k, comparator);
			else return undefined;
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) > 0 : k > this.k) {
			if (this.r) return this.r.search(k, comparator);
			else return undefined;
		}
	}

	/**
	 * Sets the key to a specific value. Inserts the node in a key-order respecting manner
	 */
	set(k: K, v: V, comparator?: (a: K, b: K) => number): void {
		if ((k as Comparable<K>).compareTo) {
			comparator = (k as Comparable<K>).compareTo;
		}
		if (
			(!this.k && !this.v) ||
			((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) === 0 : this.k === k)
		) {
			this.k = k;
			this.v = v;
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) < 0 : k < this.k) {
			if (this.l) this.l.set(k, v);
			else this.l = new Node<V, K>({ k, v });
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) > 0 : k > this.k) {
			if (this.r) this.r.set(k, v);
			else this.r = new Node<V, K>({ k, v });
		}
		this.updateHeight();
	}

	/**
	 * Generator function
	 * that returns all the values of the nodes below and this in an ascending order
	 */
	*[Symbol.iterator](): IterableIterator<V> {
		if (this.l) yield* this.l;
		if (this.k) yield this.v;
		if (this.r) yield* this.r;
	}

	/**
	 * Generator function
	 * that returns all the values of the nodes below and this in an descending order
	 */
	*descend(): IterableIterator<V> {
		if (this.r) yield* this.r;
		if (this.k) yield this.v;
		if (this.l) yield* this.l;
	}

	/**
	 * Returns all the nodes below and including this
	 */
	*nodes(): IterableIterator<Node<V, K>> {
		if (this.l) yield* this.l.nodes();
		yield this;
		if (this.r) yield* this.r.nodes();
	}

	/**
	 * Rebalances the tree below the node if the height differences are too big
	 */
	rebalance(): Node<V, K> {
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
	private rlrotate(): Node<V, K> {
		this.r = this.r.rrotate();
		return this.lrotate();
	}

	/**
	 * Performs a left-right rotation
	 */
	private lrrotate(): Node<V, K> {
		this.l = this.l.lrotate();
		return this.rrotate();
	}

	/**
	 * Performs a right rotation on the tree
	 */
	private rrotate(): Node<V, K> {
		const root: Node<V, K> = this.l;
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
	private lrotate(): Node<V, K> {
		const root: Node<V, K> = this.r;
		this.r = root.l;
		root.l = this;
		this.updateHeight();
		if (this.l) this.l.updateHeight();
		root.updateHeight();
		return root;
	}

	/**
	 * String representation of a node
	 */
	toString(): string {
		return `l: ${this.l ? this.l.k : '-'} {k: ${this.k} v: ${this.v}} r: ${this.r ? this.r.k : '-'} h: ${this.h}`;
	}
}
