import { Node } from './node.class';
import { Convertable } from './convertable.interface';
import { Options } from './options.interface';

/**
 * AVL Search Tree
 *
 * For examples check my mocha tests.
 *
 * TODO: deletion
 * TODO: priority
 * TODO: Tests
 */

/**
 * AVL Tree
 */
export class Tree<V = number | string, K extends number | string | V | Convertable<K> = number | string> {
	root: Node<V, K>;

	/**
	 * Creates an instance of AVL. Can set a comparator and/or a converter from here.
	 * Priority as follows:
	 * 1.) opts.comparator
	 */
	constructor(private _opts: Options<V, K> = {}) {}

	set opts(opts: Options<V, K>) {
		console.log(`setopts from: ${JSON.stringify(this.opts)} to: ${JSON.stringify(opts)}`);
		Object.assign(this.opts, opts);
		if (this.root) this.root.opts = this.opts;
	}

	get opts(): Options<V, K> {
		return this._opts;
	}

	set converter(converter: (v: V) => K) {
		this.opts.converter = converter;
	}

	get converter(): (v: V) => K {
		return this.opts.converter;
	}

	/**
	 * Compares two values if 'a' is bigger than 'b' it returns a negative value
	 *
	 * Example when using numbers as values:
	 *
	 * const comparator: <K>(a: K, b: K) => number = (a: number, b: number) => a - b;
	 * Another example:
	 *
	 * const comparator: <K>(a: K, b: K) => number = (a, b) => (a === b ? 0 : a > b ? 1 : -1);
	 */
	set comparator(comparator: (a: K, b: K) => number) {
		this._opts.comparator = comparator;
	}

	get comparator(): (a: K, b: K) => number {
		return this._opts.comparator;
	}

	/**
	 * The push method tries to convert the value into a number to use it as a Key
	 * if it has a convertTo method (suggested, but not necessarily by the Convertable interface)
	 * it will use that. If not, but you've set a converter
	 */
	public push(...input: V[]): void {
		for (const v of input) {
			let k: K;
			// TODO: BigInt option based on ES level
			if (typeof v === 'number' || typeof v === 'string' /*|| typeof v === 'bigint'*/) {
				k = v as K;
			}
			if (!k && ((v as unknown) as Convertable<K>).convertTo) {
				k = (<Convertable<K>>(v as unknown)).convertTo();
			}
			if (!k && this.converter) {
				k = this.converter.bind(v)(v);
			}
			if (!!k) {
				this.set(k as K, v);
			} else if (!this.comparator) {
				throw new Error(
					'cant put, no sufficient conversion method. Either use an AVL.Convertable or supply a converter'
				);
			}
		}
	}

	/**
	 * I reconstuct the opts because in the node, it will be modified
	 */
	public set(k: K, v: V): void {
		if (!this.root) this.root = new Node<V, K>({ ...this.opts }, { k, v });
		else this.root.set(k, v);
		this.root = this.root.rebalance();
		this.root.calch(); // Not really important, just for debugging to see the correct value
	}

	public put(...input: { k: K; v: V }[]) {
		for (const { k, v } of input) {
			this.set(k, v);
		}
	}

	/**
	 * Returns the first element.
	 * Complexity: O(1)
	 */
	min(): V {
		return this.root ? this.root.first().v : undefined;
	}

	/**
	 * Returns the last element.
	 * Complexity: O(1)
	 */
	max(): V {
		return this.root ? this.root.last().v : undefined;
	}

	pop(): V {
		// remove and return max
		return undefined;
	}

	get length(): number {
		let c = 0;
		for (const v of this) c++;
		return c;
	}

	forEach(callback: (i: V) => void): void {
		for (const item of this) callback(item as V);
	}

	get(k: K): V {
		if (this.root) return this.root.search(k);
	}

	has(k: K): boolean {
		if (this.root) return !!this.get(k);
	}

	/**
	 * Iterate through the values in ascending order
	 */
	*[Symbol.iterator](): IterableIterator<V> {
		if (this.root) yield* this.root;
	}

	*descend(): IterableIterator<V> {
		if (this.root) yield* this.root.descend();
	}

	/**
	 * For debug purposes
	 *
	 * Complexity:
	 *  call: O(1), iterating through: O(n)
	 */
	/*private*/ *nodes(): IterableIterator<Node<V, K>> {
		if (this.root) yield* this.root.nodes();
	}

	/**
	 * Complexity: O(n)
	 */
	toArray(): Array<V> {
		const arr: Array<V> = [];
		for (const v of this) arr.push(v);
		return arr;
	}
}
