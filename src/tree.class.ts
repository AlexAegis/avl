import 'reflect-metadata';
import { Constructor, TypedJSON, jsonMember, jsonObject, toJson } from 'typedjson';
import { CompareError } from './error/compare.error';
import { ConvertError } from './error/convert.error';
import { Comparable } from './interface/comparable.interface';
import { Convertable } from './interface/convertable.interface';
import { Node } from './node.class';
import { Enclosing } from './type/enclosing.type';

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

	differenceFromRight = Infinity;
	differenceFromLeft = Infinity;
	nearestFromRight: Node<K, V>;
	nearestFromLeft: Node<K, V>;

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
	 *
	 * Bit tricky to use. You have to supply the constructor of the key and the value. If it's a primitive
	 * you can just leave it undefined
	 * example:
	 *
	 * ```typescript
	 * const tree = Tree.parse<number, Basic>(treeAsString, undefined, Basic);
	 * ```
	 * If those subtypes are also generic (and annotated by TypedJSON) you can add extra knownTypes after the initial two too.
	 */
	public static parse<
		K extends number | string | V | Comparable<K> | any = number | string,
		V extends number | string | Convertable<K> | any = any
	>(
		tree: string,
		keyType?: Constructor<K>,
		valueType?: Constructor<V>,
		...extra: Array<Constructor<any>>
	): Tree<K, V> {
		return TypedJSON.parse<Tree<K, V>>(tree, Tree, {
			knownTypes: [Number, String, keyType, valueType, ...extra].filter((val) => val !== undefined),
		});
	}

	/**
	 * Please don't use this for the love of god
	 */
	public invert(): void {
		if (this.root) this.root.invert();
	}

	public enclosing(k: K): Enclosing<V> {
		return { last: this.lastBefore(k), first: this.firstFrom(k) };
	}

	public enclosingNodes(k: K): Enclosing<Node<K, V>> {
		this.nearestFromRight = undefined;
		this.nearestFromLeft = undefined;
		this.differenceFromRight = Infinity;
		this.differenceFromLeft = Infinity;
		if (!this.root) {
			return;
		} else {
			const fin = this.finalOperators(k);
			this.root.search(fin.key, fin.comp, this);
			return { last: this.nearestFromLeft, first: this.nearestFromRight };
		}
	}

	public lastBefore(k: K): V {
		const lastNode = this.lastNodeBefore(k);
		return lastNode && lastNode.v;
	}

	public lastNodeBefore(k: K): Node<K, V> {
		return this.enclosingNodes(k).last;
	}

	/**
	 * Returns the first value it founds on key or after that
	 */
	public firstFrom(k: K): V {
		const firstNode = this.firstNodeFrom(k);
		return firstNode && firstNode.v;
	}

	/**
	 * Returns the first node it founds on key or after that
	 */
	public firstNodeFrom(k: K): Node<K, V> {
		return this.enclosingNodes(k).first;
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
			if (this.root) result = result && this.root.search(fin.key, fin.comp) !== undefined;
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
			if (this.root) result = result || this.root.search(fin.key, fin.comp) !== undefined;
		}
		return result;
	}

	/**
	 * Returns with the value on the supplied key. undefined if there is no value on that key
	 */
	public get(key: K): V {
		const node = this.getNode(key);
		return node ? node.v : undefined;
	}

	/**
	 * Returns with the node on the supplied key. undefined if there is no node on that key
	 */
	public getNode(key: K): Node<K, V> {
		const fin = this.finalOperators(key);
		return this.root && this.root.search(fin.key, fin.comp);
	}

	public remove(key: K): V {
		const fin = this.finalOperators(key);
		if (this.root) {
			const report = { removed: undefined as V };
			this.root = this.root.remove(fin.key, report, fin.comp);
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
			this.root = this.root.set(fin.key, value, report, fin.comp);
			return report.success;
		}
	}

	private finalOperators(k: K): { key: K; comp: (a: K, b: K) => number } {
		// 1) Explicit comparator
		const result = { key: undefined as K, comp: this.comparator };

		// 2) Implicit comparator
		if (result.comp === undefined && (k as unknown as Comparable<K>).compareTo) {
			result.comp = (k as unknown as Comparable<K>).compareTo;
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
	private convert(value: (V & K) | Convertable<K>): K {
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
	 * Returns the first node.
	 */
	public first(): Node<K, V> {
		return this.root && this.root.first();
	}

	/**
	 * Returns the last node.
	 */
	public last(): Node<K, V> {
		return this.root && this.root.last();
	}

	/**
	 * This method will move the node object found at the key to the correct position in the tree.
	 * This does not reconstruct the object.
	 *
	 * If you try to move the node to an key thats already exists the method will do nothing
	 */
	public moveNode(from: K, to: K): boolean {
		const fin = this.finalOperators(to);
		const node = this.getNode(from);
		const toNode = this.getNode(to);
		if (this.root && node && !toNode) {
			const report = { success: true };
			this.remove(node.key);
			node.k = to;
			this.root = this.root.set(node.k, node.v, report, fin.comp, node);
			return report.success;
		} else return false;
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

	public *nodes(): IterableIterator<Node<K, V>> {
		if (this.root) yield* this.root.nodes();
	}

	public *reverseNodes(): IterableIterator<Node<K, V>> {
		if (this.root) yield* this.root.reverseNodes();
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
