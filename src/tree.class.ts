import { Comparable } from './interface/comparable.interface';
import { Node } from './node.class';
import { Convertable } from './interface/convertable.interface';
import { ConvertError } from './error/convert.error';
import { CompareError } from './error/compare.error';

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
	K extends number | string | V | Comparable<K> | any = number | string,
	V extends number | string | Convertable<K> | any = any
> {
	private root: Node<K, V>;

	/**
	 * Creates an instance of AVL. Can set a converter from here.
	 */
	public constructor(private _comparator?: (a: K, b: K) => number, private _converter?: (value: V) => K) {}

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
	public has(key: K): boolean {
		const fin = this.finalOperators(key);
		if (this.root) return this.root.search(fin.key, fin.comp, fin.compOwn) !== undefined;
	}

	/**
	 * Returns with the value on the supplied key. undefined if there is no value on that key
	 */
	public get(key: K): V {
		const fin = this.finalOperators(key);
		if (this.root) return this.root.search(fin.key, fin.comp, fin.compOwn);
	}

	public remove(key: K): V {
		const fin = this.finalOperators(key);
		if (this.root) {
			const report = { removed: undefined as V };
			this.root = this.root.remove(fin.key, report, fin.comp, fin.compOwn);
			return report.removed;
		}
	}

	/**
	 * sets a key to a value
	 */
	public set(key: K, value: V): boolean {
		const fin = this.finalOperators(key);
		if (!this.root) {
			this.root = new Node<K, V>(fin.key, value);
			return true;
		} else {
			const report = { success: true };
			this.root = this.root.set(fin.key, value, report, fin.comp, fin.compOwn);
			return report.success;
		}
	}

	private finalOperators(k: K): { key: K; comp: (a: K, b: K) => number; compOwn: boolean } {
		const result = { key: undefined as K, comp: this.comparator, compOwn: false };

		// 1) Explicit comparator
		result.comp = this.comparator;

		// 2) Implicit comparator
		if (result.comp === undefined && ((k as unknown) as Comparable<K>).compareTo) {
			result.comp = ((k as unknown) as Comparable<K>).compareTo;
			result.compOwn = true;
		}

		if (!result.comp) {
			result.key = this.convert(k as V & K); // 3) Explicit convert 4) Implicit convert (Can throw ConvertError)
		} else {
			result.key = k; // 5) As is
		}

		if (!result.comp && result.key === undefined) {
			throw new CompareError();
		}

		return result;
	}

	/**
	 * Tries to convert the value. If its a convertable it will use it's inner converter.
	 * If not, it tries to use the supplied converter in the ops.
	 * Or optionally you can supply a converter method, but this wont be saved into the Tree
	 * If you want a permament converter use the opts or just set the converter field of the Tree
	 * TODO: bigint option if supported
	 */
	private convert(value: V & K | Convertable<K>): K {
		let k: K;

		if (typeof value === 'number' || typeof value === 'string') k = value as K;

		if (k === undefined && this.converter) k = this.converter.bind(value)(value);

		if (k === undefined && (value as Convertable<K>).convertTo) k = (value as Convertable<K>).convertTo();

		if (k !== undefined) return k;

		throw new ConvertError();
	}

	/**
	 * Sets multiple values to multiple keys
	 */
	public put(...input: { key: K; value: V }[]): boolean {
		let result = true;
		for (const { key: k, value: v } of input) {
			result = result && this.set(k, v);
		}
		return result;
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
	public forEach(callback: (value: V, index?: number) => void): void {
		let i = 0;
		for (const item of this) {
			callback(item as V, i);
			i++;
		}
	}

	/**
	 * Calls a function on each element of the Tree, in order.
	 * There is an optional index
	 */
	public forEachReversed(callback: (value: V, index?: number) => void): void {
		let i = 0;
		for (const item of this.reverse()) {
			callback(item as V, i);
			i++;
		}
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
	public *reverse(): IterableIterator<V> {
		if (this.root) yield* this.root.reverse();
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

	set converter(converter: (value: V) => K) {
		this._converter = converter;
	}

	get converter(): (value: V) => K {
		return this._converter;
	}

	/**
	 * Returns the current height of the tree
	 */
	public get height(): number {
		return this.root ? this.root.height : 0;
	}

	/**
	 * Debugging
	 *
	 */
	public print(): void {
		for (const node of this.root.nodes()) {
			console.log(`${'-'.repeat(node.height * 7)} ${node.toString()}`);
		}
	}
}
