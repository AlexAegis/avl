import { Node } from './node.class';
import { Convertable } from './convertable.interface';
import { Options } from './options.interface';

/**
 * AVL Search Tree
 *
 * For examples check my mocha tests.
 *
 * TODO: deletion
 */

/**
 * AVL Tree
 */
export class Tree<V = number | string, K extends number | string | V | Convertable<K> = number | string> {
	private root: Node<V, K>;

	/**
	 * Creates an instance of AVL. Can set a converter from here.
	 * Priority as follows:
	 * 1.) opts.comparator
	 */
	constructor(private _opts: Options<V, K> = {}) {}

	set opts(opts: Options<V, K>) {
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
	 * The push method tries to convert the value into a number to use it as a Key
	 * if it has a convertTo method (suggested, but not necessarily by the Convertable interface)
	 * it will use that. If not, but you've set a converter
	 */
	public push(...input: V[]): void {
		for (const v of input) {
			const k: K = this.convert(v as K);
			if (k) this.set(k as K, v);
		}
	}

	/**
	 * sets a key to a value
	 */
	public set(k: K, v: V): void {
		if (!this.root) this.root = new Node<V, K>(this.opts, { k, v });
		else this.root.set(k, v);
		this.root = this.root.rebalance();
		this.root.calch();
	}

	/**
	 * Sets multiple values to multiple keys
	 */
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

	popFirst(): V {
		return undefined;
	}

	/**
	 * Sums up how many nodes there are in the Tree
	 */
	get length(): number {
		let c = 0;
		for (const v of this) c++;
		return c;
	}

	/**
	 * Calls a function on each element of the Tree, in order.
	 * There is an optional index
	 */
	forEach(callback: (i: V, index?: number) => void): void {
		let i = 0;
		for (const item of this) {
			callback(item as V, i);
			i++;
		}
	}

	/**
	 * Retruns with the value on the supplied key. undefined if there is no value on that key
	 */
	get(k: K): V {
		if (this.root) return this.root.search(k);
	}

	/**
	 * Tries to convert the value. If its a convertable it will use it's inner converter.
	 * If not, it tries to use the supplied converter in the ops.
	 * Or optionally you can supply a converter method, but this wont be saved into the Tree
	 * If you want a permament converter use the opts or just set the converter field of the Tree
	 * TODO: BigInt option based on ES level
	 */
	convert(v: K | Convertable<K>, converter?: (v: V) => K): K {
		let k: K;

		if (converter) return converter.bind(v)(v);

		if (typeof v === 'number' || typeof v === 'string' /*|| typeof v === 'bigint'*/) {
			k = v as K;
		}
		if (!k && ((v as unknown) as Convertable<K>).convertTo) {
			k = (<Convertable<K>>(v as unknown)).convertTo();
		}
		if (!k && this.converter) {
			k = this.converter.bind(v)(v);
		}
		if (k) {
			return k as K;
		}
		throw new Error(
			'Cannot convert, no sufficient conversion method. Either use a Convertable or supply a converter'
		);
	}

	has(k: K | Convertable<K>): boolean {
		if (this.root) return !!this.get(this.convert(k));
	}

	/**
	 * Iterate through the values in ascending order
	 */
	*[Symbol.iterator](): IterableIterator<V> {
		if (this.root) yield* this.root;
	}

	/**
	 * Iterate through the values in descending order
	 */
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

	toString(): string {
		let acc = '';
		for (const node of this.nodes()) {
			acc += node.toString() + '\n';
		}
		return acc;
	}

	print(): void {
		console.log(this.toString());
	}
}
