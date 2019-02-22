import { CompareError } from './compare.error';
import { Convertable } from './convertable.interface';
import { Comparable } from './comparable.interface';
export class Node<
	V extends number | string | Convertable<K> | any = any,
	K extends number | string | V | Comparable<K> | any = number | string
> {
	private l: Node<V, K>;
	private r: Node<V, K>;
	private h = 1;
	constructor(private k: K, private v: V) {}

	/**
	 * Generator function
	 * that returns all the values of the nodes below and this in an ascending order
	 */
	public *[Symbol.iterator](): IterableIterator<V> {
		if (this.l) yield* this.l;
		if (this.k !== undefined) yield this.v;
		if (this.r) yield* this.r;
	}

	/**
	 * Generator function
	 * that returns all the values of the nodes below and this in an descending order
	 */
	public *reverse(): IterableIterator<V> {
		if (this.r) yield* this.r.reverse();
		if (this.k !== undefined) yield this.v;
		if (this.l) yield* this.l.reverse();
	}

	public get key(): K {
		return this.k;
	}

	public get value(): V {
		return this.v;
	}

	public get height(): number {
		return this.h;
	}

	/**
	 * Returns the first element.
	 * Complexity: O(1)
	 */
	public first(): Node<V, K> {
		if (this.l) return this.l.first();
		else return this;
	}

	/**
	 * Returns the last element.
	 * Complexity: O(1)
	 */
	public last(): Node<V, K> {
		if (this.r) return this.r.last();
		else return this;
	}

	/**
	 * Calculates the height of the node. A leafs (node without either a left or a right node) height is
	 */
	private updateHeight(): void {
		this.h = 1 + Math.max(this.l ? this.l.h : 0, this.r ? this.r.h : 0);
	}

	/**
	 * Searches for a Node containing a key
	 * @returns the value or undefined if its not found
	 */
	public search(k: K, comparator?: (a: K, b: K) => number): V {
		if (((k as unknown) as Comparable<K>).compareTo) {
			comparator = ((k as unknown) as Comparable<K>).compareTo;
		} else if (typeof k !== 'string' && typeof k !== 'number') {
			throw new CompareError();
		}
		if (
			this.k !== undefined &&
			(((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) === 0 : this.k === k)
		) {
			return this.v as V;
		} else if (((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) < 0 : k < this.k) {
			if (this.l) return this.l.search(k, comparator);
		} else if (((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) > 0 : k > this.k) {
			if (this.r) return this.r.search(k, comparator);
		}
	}

	/**
	 * Sets the key to a specific value. Inserts the node in a key-order respecting manner
	 * @returns the new root
	 */
	public set(k: K, v: V, reporter: { success: boolean }, comparator?: (a: K, b: K) => number): Node<V, K> {
		if (((k as unknown) as Comparable<K>).compareTo) {
			comparator = ((k as unknown) as Comparable<K>).compareTo;
		} else if (typeof k !== 'string' && typeof k !== 'number') throw new CompareError();
		if (((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) < 0 : k < this.k) {
			if (this.l) this.l = this.l.set(k, v, reporter, comparator);
			else this.l = new Node<V, K>(k, v);
		} else if (((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) > 0 : k > this.k) {
			if (this.r) this.r = this.r.set(k, v, reporter, comparator);
			else this.r = new Node<V, K>(k, v);
		} else if (
			(this.k === undefined && this.v === undefined) ||
			(((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) === 0 : this.k === k)
		) {
			this.k = k;
			this.v = v;
			if (reporter) reporter.success = false;
		}
		this.updateHeight();
		return this.rebalance();
	}

	/**
	 * Removes a node from the tree.
	 * Reports the removed value in the reporter object
	 * @returns the new root
	 */
	public remove(k: K, reporter?: { removed: V }, comparator?: (a: K, b: K) => number): Node<V, K> {
		if (((k as unknown) as Comparable<K>).compareTo) {
			comparator = ((k as unknown) as Comparable<K>).compareTo;
		} else if (typeof k !== 'string' && typeof k !== 'number') throw new CompareError();
		if (((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) < 0 : k < this.k) {
			if (this.l) this.l = this.l.remove(k, reporter, comparator);
		} else if (((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) > 0 : k > this.k) {
			if (this.r) this.r = this.r.remove(k, reporter, comparator);
		} else if (
			this.k !== undefined &&
			(((k as unknown) as Comparable<K>).compareTo ? comparator.bind(k)(this.k) === 0 : this.k === k)
		) {
			if (reporter) reporter.removed = this.v;
			if (!this.l && !this.r) {
				return undefined;
			} else if (this.l ? !this.r : this.r) {
				return this.l || this.r;
			} else {
				const llast = this.l.last();
				this.v = llast.v;
				this.k = llast.k;
				this.l = this.l.remove(llast.k);
			}
		}
		this.updateHeight();
		return this.rebalance();
	}

	/**
	 * Rebalances the tree below the node if the height differences are too big
	 */
	private rebalance(): Node<V, K> {
		const lh = this.l ? this.l.h : 0;
		const rh = this.r ? this.r.h : 0;
		if (lh > rh + 1) {
			if (((this.l && this.l.l && this.l.l.h) || 0) > ((this.l && this.l.r && this.l.r.h) || 0)) {
				return this.rrotate();
			} else return this.lrrotate();
		} else if (rh > lh + 1) {
			if (((this.r && this.r.r && this.r.r.h) || 0) > ((this.r && this.r.l && this.r.l.h) || 0)) {
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
}
