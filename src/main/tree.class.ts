import { Comparable } from './comparable.interface';
import { Node } from './node.class';
import { Convertable } from './convertable.interface';
import { ConvertError } from './convert.error';

/**
 * AVL Search Tree
 *
 * For examples check my mocha tests.
 *
 * Comparable might make sense if both the keying and the comparing is done
 *
 *  ITS THE KEY THAT HAS TO BE COMPARABLE OR PRIMITIVE
 * TODO: deletion
 */

/**
 * AVL Tree
 */
export class Tree<
	V extends number | string | Convertable<K> | any = number | string,
	K extends number | string | V | Comparable<K> = number | string
> {
	private root: Node<V, K>;

	/**
	 * Creates an instance of AVL. Can set a converter from here.
	 */
	constructor(private converter?: (v: V) => K, private comparator?: (a: K, b: K) => number) {}

	/**
	 * The push method tries to convert the value into a number to use it as a Key
	 * if it has a convertTo method (suggested, but not necessarily by the Convertable interface)
	 * it will use that. If not, but you've set a converter
	 */
	public push(...input: V[]): void {
		for (const v of input) {
			const k: K = this.convert(v as K);
			if (k || k === 0) this.set(k as K, v);
		}
	}

	/**
	 * Accessing a key would first check if the key is comparable or is there a comparator
	 * if not, it tries to convert it
	 */
	public has(k: K): boolean {
		if (!(k as Comparable<K>).compareTo && !this.comparator) {
			k = this.convert(k);
		}
		if (this.root) return !!this.root.search(k, this.comparator);
	}

	/**
	 * Returns with the value on the supplied key. undefined if there is no value on that key
	 */
	public get(k: K): V {
		if (!(k as Comparable<K>).compareTo && !this.comparator) {
			k = this.convert(k);
		}
		if (this.root) return this.root.search(k, this.comparator);
	}

	/**
	 * sets a key to a value
	 */
	public set(k: K, v: V): void {
		if (!this.root) this.root = new Node<V, K>({ k, v });
		else this.root.set(k, v, this.comparator);
		this.root = this.root.rebalance();
		this.root.updateHeight();
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
	 * Tries to convert the value. If its a convertable it will use it's inner converter.
	 * If not, it tries to use the supplied converter in the ops.
	 * Or optionally you can supply a converter method, but this wont be saved into the Tree
	 * If you want a permament converter use the opts or just set the converter field of the Tree
	 * TODO: BigInt option based on ES level
	 */
	convert(v: K | Convertable<K>, converter?: (v: V) => K): K {
		let k: K;

		if (converter) return converter.bind(v)(v);

		if (typeof v === 'number' || typeof v === 'string') k = v as K;

		if (!k && (v as Convertable<K>).convertTo) k = (v as Convertable<K>).convertTo();

		if (!k && this.converter) k = this.converter.bind(v)(v);

		if (!!k || k === 0) return k as K;

		throw new ConvertError();
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
