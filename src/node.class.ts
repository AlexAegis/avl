import { Convertable, Options } from './avl.class';

export class Node<V, K extends number | string | V | Convertable<K> = number> {
	l: Node<V, K>;
	r: Node<V, K>;
	h: number;
	k: K;
	v: V;
	constructor(private _opts: Options<V, K>, ...init: { k: K; v: V }[]) {
		for (const { k, v } of init) this.set(k, v);
	}

	/**
	 * the opts in a node delete themself upon conversion (but not on comparing)
	 * If ever needing to change the converter (or the comparator by that matter), this will help resetting it everywhere
	 */
	set opts(opts: Options<V, K>) {
		if (this.l) this.l.opts = opts;
		this._opts = opts;
		if (this.r) this.r.opts = opts;
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
	calch(): void {
		this.h = 1 + Math.max(this.l ? this.l.h : 0, this.r ? this.r.h : 0);
	}

	tryConvert(k: K | Convertable<K>): void {
		if ((k as Convertable<K>).convertTo) {
			k = (<Convertable<K>>k).convertTo();
			this._opts.comparator = undefined; // if its also comparable and convertable, only use the convert
		} else if (this._opts.converter) {
			k = this._opts.converter(k as V);
			this._opts.comparator = undefined;
			this._opts.converter = undefined;
		}
	}

	/**
	 * TODO: Check that triple equals
	 */
	search(k: K | Convertable<K>): V {
		this.tryConvert(k);

		if (this.k && (!!this._opts.comparator ? this._opts.comparator(k as K, this.k) === 0 : k === this.k)) {
			return this.v as V;
		} else if (!!this._opts.comparator ? this._opts.comparator(k as K, this.k) < 0 : k < this.k) {
			if (this.l) return this.l.search(k);
			else return undefined;
		} else if (!!this._opts.comparator ? this._opts.comparator(k as K, this.k) > 0 : k > this.k) {
			if (this.r) return this.r.search(k);
			else return undefined;
		}
	}

	set(k: K, v?: V) {
		this.tryConvert(k);

		if (
			(!this.k && !this.v) ||
			(!!this._opts.comparator ? this._opts.comparator(k as K, this.k) === 0 : k === this.k)
		) {
			this.k = k;
			this.v = v;
		} else if (!!this._opts.comparator ? this._opts.comparator(k as K, this.k) < 0 : k < this.k) {
			if (this.l) this.l.set(k, v);
			else this.l = new Node<V, K>(this._opts, { k, v });
		} else if (!!this._opts.comparator ? this._opts.comparator(k as K, this.k) > 0 : k > this.k) {
			if (this.r) this.r.set(k, v);
			else this.r = new Node<V, K>(this._opts, { k, v });
		}
		this.calch();
	}

	*[Symbol.iterator](): IterableIterator<V> {
		if (this.l) yield* this.l;
		if (this.k) yield this.v;
		if (this.r) yield* this.r;
	}

	*descend(): IterableIterator<V> {
		if (this.r) yield* this.r;
		if (this.k) yield this.v;
		if (this.l) yield* this.l;
	}

	*nodes(): IterableIterator<Node<V, K>> {
		if (this.l) yield* this.l.nodes();
		yield this;
		if (this.r) yield* this.r.nodes();
	}

	toString(): string {
		return `l: ${this.l ? this.l.k : '-'} {k: ${this.k} v: ${this.v}} r: ${this.r ? this.r.k : '-'} h: ${this.h}`;
	}

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

	private rlrotate(): Node<V, K> {
		this.r = this.r.rrotate();
		return this.lrotate();
	}

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
		this.calch();
		if (this.r) this.r.calch();
		root.calch();
		return root;
	}

	/**
	 * Performs a right rotation on the tree
	 */
	private lrotate(): Node<V, K> {
		const root: Node<V, K> = this.r;
		this.r = root.l;
		root.l = this;
		this.calch();
		if (this.l) this.l.calch();
		root.calch();
		return root;
	}
}
