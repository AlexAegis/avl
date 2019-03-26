import 'reflect-metadata';
import { Comparable } from './interface/comparable.interface';
import { Node } from './node.class';
import { Convertable } from './interface/convertable.interface';
import { ConvertError } from './error/convert.error';
import { CompareError } from './error/compare.error';
import { jsonObject, jsonMember, toJson, TypedJSON } from 'typedjson';
import { Constructor } from 'typedjson/js/typedjson/types';
import { hashOrReturn } from './helper/hash.function';

/**
 * AVL Tree
 */
@jsonObject
@toJson
export class Tree<
	K extends number | string | V | Comparable<K> | any = number | string,
	V extends number | string | Convertable<K> | any = any
> {
	/**
	 * Creates an instance of AVL. Can set a converter from here.
	 */
	public constructor(private _comparator?: (a: K, b: K) => number, private _converter?: (value: V) => K) {}

	/**
	 * Sums up how many nodes there are in the Tree
	 */
	public get length(): number {
		let c = 0;
		for (const v of this) c++;
		return c;
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
	@jsonMember
	private root: Node<K, V>;

	difference = Infinity;
	nearest: Node<K, V>;

	/**
	 * ! WARNING: Limited capabilities!
	 * ! The converted tree must use Objects (Not Numbers, not Strings, Objects)
	 * ! on both the key and value to be working
	 * ! (Workaround: use wrapper objects)
	 * ! It also can't restore the explicit converter and comparator functions
	 * ! as JavaScript can't parse functions (reliably)
	 * ! (Workaround: use implicit converters and comparables)
	 *
	 * * The first limitation I believe can be improved with the Reflection-metadata API
	 * * which is included in this project but not used as I couldn't make TypedJSON work
	 * * with that. Feel free to contact me if you know a solution on supplying the constructor
	 * * reference dynamically while the tree is building so it can be used when stringifying
	 */
	public static parse<
		K extends number | string | V | Comparable<K> | any = number | string,
		V extends number | string | Convertable<K> | any = any
	>(tree: string, keyType?: Constructor<K>, valueType?: Constructor<V>): Tree<K, V> {
		const typeResolver = (sourceObject: any, knownTypes: Map<string, Function>) => {
			if (sourceObject.__type) return knownTypes.get(sourceObject.__type);
		};
		return TypedJSON.parse<Tree<K, V>>(tree, Tree, { typeResolver: typeResolver });
	}

	public enclosingNodes(k: K): { last: Node<K, V>; first: Node<K, V> } {
		return { last: this.lastNodeFrom(k), first: this.firstNodeFrom(k) };
	}

	public lastNodeFrom(k: K): Node<K, V> {
		return this.nearestNodeFrom(k, false);
	}

	private nearestNodeFrom(k: K, fromRight: boolean): Node<K, V> {
		if (!this.root) {
			return;
		} else {
			const fin = this.finalOperators(k);
			this.nearest = this.root;
			this.difference = ((k as unknown) as Comparable<K>).compareTo
				? fin.comp.apply(
						fin.key,
						(fin.comp.prototype ? !fin.compOwn : fin.compOwn) ? [this.root.k, fin.key] : [k, this.root.k]
				  )
				: hashOrReturn(fin.key as any) - hashOrReturn(this.root.k as any);
			this.root.search(fin.key, fin.comp, fin.compOwn, fromRight, this);
			return this.nearest;
		}
	}

	/**
	 * Returns the first node it founds on key or after that
	 */
	public firstNodeFrom(k: K): Node<K, V> {
		return this.nearestNodeFrom(k, true);
	}

	/**
	 * Because it's marked with @ToJSon we can sumply use JSON.stringify.
	 * I'm putting this method here for brevity
	 */
	public stringify(): string {
		const typeResolver = (sourceObject: any, knownTypes: Map<string, Function>) => {
			if (sourceObject.__type) return knownTypes.get(sourceObject.__type);
		};
		return TypedJSON.stringify<Tree<K, V>>(this, Tree, { typeResolver: typeResolver });
	}

	/**
	 * The push method tries to convert the value into a number to use it as a Key
	 * if it has a convertTo method (suggested, but not necessarily by the Convertable interface)
	 * it will use that. If not, but you've set a converter
	 */
	public push(...input: Array<V>): boolean {
		let res = true;
		for (const v of input) {
			res = res && this.set(v as K & V, v);
		}
		return res;
	}

	/**
	 * Return true if every key is contained
	 */
	public has(...keys: Array<K>): boolean {
		let result = true;
		for (const key of keys) {
			const fin = this.finalOperators(key);
			if (this.root) result = result && this.root.search(fin.key, fin.comp, fin.compOwn) !== undefined;
		}
		return result;
	}

	/**
	 * Return true if any of the key is contained
	 */
	public any(...keys: Array<K>): boolean {
		let result = false;
		for (const key of keys) {
			const fin = this.finalOperators(key);
			if (this.root) result = result || this.root.search(fin.key, fin.comp, fin.compOwn) !== undefined;
		}
		return result;
	}

	/**
	 * Returns with the value on the supplied key. undefined if there is no value on that key
	 */
	public get(key: K): V {
		const fin = this.finalOperators(key);
		const node = this.root.search(fin.key, fin.comp, fin.compOwn);
		if (this.root) return node ? node.v : undefined;
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
