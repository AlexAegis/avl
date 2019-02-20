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
		if (
			this.k !== undefined &&
			((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) === 0 : this.k === k)
		) {
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
	set(k: K, v: V, comparator?: (a: K, b: K) => number): boolean {
		let overwrite = false;
		if ((k as Comparable<K>).compareTo) {
			comparator = (k as Comparable<K>).compareTo;
		}
		if (
			(this.k === undefined && this.v === undefined) ||
			((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) === 0 : this.k === k)
		) {
			this.k = k;
			this.v = v;
			overwrite = true;
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) < 0 : k < this.k) {
			if (this.l) return this.l.set(k, v);
			else this.l = new Node<V, K>({ k, v });
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(this.k) > 0 : k > this.k) {
			if (this.r) return this.r.set(k, v);
			else this.r = new Node<V, K>({ k, v });
		}
		this.updateHeight();
		return overwrite;
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
	 * String representation of a node
	 */
	toString(): string {
		return `l: ${this.l ? this.l.k : '-'} {k: ${this.k} v: ${this.v}} r: ${this.r ? this.r.k : '-'} h: ${this.h}`;
	}
}
