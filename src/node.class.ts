import { Convertable } from './interface/convertable.interface';
import { Comparable } from './interface/comparable.interface';
import { jsonObject, jsonMember } from 'typedjson';
import { Tree } from './tree.class';
import { hashOrReturn } from './helper/hash.function';

@jsonObject
export class Node<
	K extends number | string | V | Comparable<K> | any = number | string,
	V extends number | string | Convertable<K> | any = any
> {
	constructor(k?: K, v?: V) {
		this.k = k;
		this.v = v;
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
	@jsonMember
	private l: Node<K, V>;
	@jsonMember
	private r: Node<K, V>;
	@jsonMember({ constructor: Number })
	private h = 1;
	@jsonMember
	public k: K;
	@jsonMember
	public v: V;

	/**
	 * Inspired by @mxcl 's [tweet](https://twitter.com/mxcl/status/608682016205344768)
	 */
	public invert(): void {
		if (this.l) this.l.invert();
		if (this.r) this.r.invert();
		[this.r, this.l] = [this.l, this.r];
	}

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

	public *nodes(): IterableIterator<Node<K, V>> {
		if (this.l) yield* this.l.nodes();
		yield this;
		if (this.r) yield* this.r.nodes();
	}

	public *reverseNodes(): IterableIterator<Node<K, V>> {
		if (this.r) yield* this.r.reverseNodes();
		yield this;
		if (this.l) yield* this.l.reverseNodes();
	}

	/**
	 * Returns/ the first element.
	 * Complexity: O(1)
	 */
	public first(): Node<K, V> {
		if (this.l) return this.l.first();
		else return this;
	}

	/**
	 * Returns the last element.
	 * Complexity: O(1)
	 */
	public last(): Node<K, V> {
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
	public search(
		k: K,
		comparator: (a: K, b: K) => number,
		treeRefForNearestSearch?: Tree<K, V> // Only used when searching for nearest values as it contains temporary fields.
	): Node<K, V> {
		// When searching for nearest values, simply track each value we are traversing while searching as we always touch them on traversal
		const comparatorResult: number =
			comparator && comparator.apply(k, comparator.length === 1 ? [this.k, k] : [k, this.k]);
		if (treeRefForNearestSearch) {
			const difference =
				comparatorResult === undefined
					? hashOrReturn(k as any) - hashOrReturn(this.k as any)
					: comparatorResult;
			if (difference >= 0 && Math.abs(treeRefForNearestSearch.differenceFromRight) >= Math.abs(difference)) {
				treeRefForNearestSearch.nearestFromLeft = this;
				treeRefForNearestSearch.differenceFromLeft = difference;
			}
			if (difference <= 0 && Math.abs(treeRefForNearestSearch.differenceFromLeft) >= Math.abs(difference)) {
				treeRefForNearestSearch.nearestFromRight = this;
				treeRefForNearestSearch.differenceFromRight = difference;
			}
		}

		if (comparatorResult !== undefined ? comparatorResult < 0 : k < this.k) {
			if (this.l) return this.l.search(k, comparator, treeRefForNearestSearch);
		} else if (comparatorResult !== undefined ? comparatorResult > 0 : k > this.k) {
			if (this.r) return this.r.search(k, comparator, treeRefForNearestSearch);
		} else return this;
	}

	/**
	 * Sets the key to a specific value. Inserts the node in a key-order respecting manner
	 * @returns the new root
	 */
	public set(
		k: K,
		v: V,
		reporter: { success: boolean },
		comparator: (a: K, b: K) => number,
		existing?: Node<K, V>
	): Node<K, V> {
		const comparatorResult: number =
			comparator && comparator.apply(k, comparator.length === 1 ? [this.k, k] : [k, this.k]);
		if (comparatorResult !== undefined ? comparatorResult < 0 : k < this.k) {
			if (this.l) this.l = this.l.set(k, v, reporter, comparator, existing);
			else this.l = existing !== undefined ? existing : new Node<K, V>(k, v);
		} else if (comparatorResult !== undefined ? comparatorResult > 0 : k > this.k) {
			if (this.r) this.r = this.r.set(k, v, reporter, comparator, existing);
			else this.r = existing !== undefined ? existing : new Node<K, V>(k, v);
		} else {
			if (existing === undefined) {
				this.k = k;
				this.v = v;
			}
			if (reporter) reporter.success = false;
		}
		this.updateHeight();
		return this.rebalance();
	}

	public lower(node: Node<K, V>, comparator: (a: K, b: K) => number) {}

	/**
	 * Removes a node from the tree.
	 * Reports the removed value in the reporter object
	 * @returns the new root
	 */
	public remove(k: K, reporter: { removed: V }, comparator: (a: K, b: K) => number): Node<K, V> {
		const comparatorResult: number =
			comparator && comparator.apply(k, comparator.length === 1 ? [this.k, k] : [k, this.k]);
		if (comparatorResult !== undefined ? comparatorResult < 0 : k < this.k) {
			if (this.l) this.l = this.l.remove(k, reporter, comparator);
		} else if (comparatorResult !== undefined ? comparatorResult > 0 : k > this.k) {
			if (this.r) this.r = this.r.remove(k, reporter, comparator);
		} else {
			if (reporter) reporter.removed = this.v;
			if (!this.l && !this.r) {
				return undefined;
			} else if (this.l ? !this.r : this.r) {
				return this.l || this.r;
			} else {
				const llast = this.l.last();
				this.v = llast.v;
				this.k = llast.k;
				this.l = this.l.remove(llast.k, undefined, comparator);
			}
		}
		this.updateHeight();
		return this.rebalance();
	}

	/**
	 * Rebalances the tree below the node if the height differences are too big
	 */
	private rebalance(): Node<K, V> {
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
	private rlrotate(): Node<K, V> {
		this.r = this.r.rrotate();
		return this.lrotate();
	}

	/**
	 * Performs a left-right rotation
	 */
	private lrrotate(): Node<K, V> {
		this.l = this.l.lrotate();
		return this.rrotate();
	}

	/**
	 * Performs a right rotation on the tree
	 */
	private rrotate(): Node<K, V> {
		const root: Node<K, V> = this.l;
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
	private lrotate(): Node<K, V> {
		const root: Node<K, V> = this.r;
		this.r = root.l;
		root.l = this;
		this.updateHeight();
		if (this.l) this.l.updateHeight();
		root.updateHeight();
		return root;
	}

	public toString(): string {
		return `l: ${this.l ? this.l.k : '-'} k: ${this.k} r: ${this.r ? this.r.k : '-'}`;
	}
}
