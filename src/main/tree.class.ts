import { Comparable } from './comparable.interface';
import { Node } from './node.class';
import { Convertable } from './convertable.interface';
import { ConvertError } from './convert.error';

/**
 * AVL Search Tree
 *
 * For examples check my mocha tests.
 *
 */

/**
 * AVL Tree
 */
export class Tree<
	V extends number | string | Convertable<K> | any = any,
	K extends number | string | V | Comparable<K> | any = number | string
> {
	private root: Node<V, K>;

	/**
	 * Creates an instance of AVL. Can set a converter from here.
	 */
	public constructor(private _comparator?: (a: K, b: K) => number, private _converter?: (v: V) => K) {}

	/**
	 * The push method tries to convert the value into a number to use it as a Key
	 * if it has a convertTo method (suggested, but not necessarily by the Convertable interface)
	 * it will use that. If not, but you've set a converter
	 */
	public push(...input: V[]): boolean {
		let res = true;
		for (const v of input) {
			res = res && this.set(v as K & V, v);
		}
		return res;
	}

	/**
	 * Accessing a key would first check if the key is comparable or is there a comparator
	 * if not, it tries to convert it
	 */
	public has(k: K): boolean {
		if (!((k as unknown) as Comparable<K>).compareTo && !this.comparator) {
			k = this.convert(k as V & K);
		}
		if (this.root) return this.root.search(k, this.comparator) !== undefined;
	}

	/**
	 * Returns with the value on the supplied key. undefined if there is no value on that key
	 */
	public get(k: K): V {
		if (!((k as unknown) as Comparable<K>).compareTo && !this.comparator) {
			k = this.convert(k as V & K);
		}
		if (this.root) return this.root.search(k, this.comparator);
	}

	public remove(k: K): V {
		if (!((k as unknown) as Comparable<K>).compareTo && !this.comparator) {
			k = this.convert(k as V & K);
		}
		if (this.root) {
			const report = { removed: undefined as V };
			this.root = this.root.remove(k, report, this.comparator);
			return report.removed;
		}
	}

	/**
	 * sets a key to a value
	 */
	public set(k: K, v: V): boolean {
		if (!((k as unknown) as Comparable<K>).compareTo && !this.comparator) {
			k = this.convert(k as V & K);
		}
		if (!this.root) {
			this.root = new Node<V, K>(k, v);
			return true;
		} else {
			const report = { success: true };
			this.root = this.root.set(k, v, report, this.comparator);
			return report.success;
		}
	}

	/**
	 * Sets multiple values to multiple keys
	 */
	public put(...input: { key: K; value: V }[]): void {
		for (const { key: k, value: v } of input) {
			this.set(k, v);
		}
	}

	/**
	 * Returns the first element.
	 */
	public min(): V {
		return this.root ? this.root.first().value : undefined;
	}

	/**
	 * Returns the last element.
	 */
	public max(): V {
		return this.root ? this.root.last().value : undefined;
	}

	/**
	 * Sums up how many nodes there are in the Tree
	 */
	public get length(): number {
		let c = 0;
		for (const v of this) c++;
		return c;
	}
	/**
	 * Calls a function on each element of the Tree, in order.
	 * There is an optional index
	 */
	public forEach(callback: (i: V, index?: number) => void): void {
		let i = 0;
		for (const item of this) {
			callback(item as V, i);
			i++;
		}
	}

	/**
	 * Tries to convert the value. If its a convertable it will use it's inner converter.
	 * If not, it tries to use the supplied converter in the ops.
	 * Or optionally you can supply a converter method, but this wont be saved into the Tree
	 * If you want a permament converter use the opts or just set the converter field of the Tree
	 * TODO: bigint option if supported
	 */
	private convert(v: V & K | Convertable<K>): K {
		let k: K;

		if (typeof v === 'number' || typeof v === 'string') k = v as K;

		if (!k && (v as Convertable<K>).convertTo) k = (v as Convertable<K>).convertTo();

		if (!k && this.converter) k = this.converter.bind(v)(v);

		if (k !== undefined) return k;

		throw new ConvertError();
	}

	/**
	 * Iterate through the values in ascending order
	 */
	public *[Symbol.iterator](): IterableIterator<V> {
		if (this.root) yield* this.root;
	}

	/**
	 * Iterate through the values in descending order
	 */
	public *descend(): IterableIterator<V> {
		if (this.root) yield* this.root.descend();
	}

	public toArray(): Array<V> {
		const arr: Array<V> = [];
		for (const v of this) arr.push(v);
		return arr;
	}

	set comparator(comparator: (a: K, b: K) => number) {
		this._comparator = comparator;
	}

	get comparator(): (a: K, b: K) => number {
		return this._comparator;
	}

	set converter(converter: (v: V) => K) {
		this._converter = converter;
	}

	get converter(): (v: V) => K {
		return this._converter;
	}

	/**
	 * Returns the current height of the tree
	 */
	public get height(): number {
		return this.root ? this.root.height : 0;
	}
}
