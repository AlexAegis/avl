import { Comparable } from './comparable.interface';
import { Node } from './node.class';
import { Convertable } from './convertable.interface';
import { ConvertError } from './convert.error';
import { SimpleNode } from './simple-node.class';

/**
 * AVL Search Tree
 *
 * For examples check my mocha tests.
 *
 * Comparable might make sense if both the keying and the comparing is done
 *
 *  ITS THE KEY THAT HAS TO BE COMPARABLE OR PRIMITIVE
 * TODO: deletion
 * TODO: might be faster if all the tree operatons are on the tree and not the node
 */

/**
 * AVL Tree
 */
export class SimpleTree {
	private root: SimpleNode;

	/**
	 * Creates an instance of AVL. Can set a converter from here.
	 */
	constructor() {}

	/**
	 * The push method tries to convert the value into a number to use it as a Key
	 * if it has a convertTo method (suggested, but not necessarily by the Convertable interface)
	 * it will use that. If not, but you've set a converter
	 */
	public push(...input: number[]): boolean {
		let brandNew = false;
		for (const v of input) {
			if (v !== undefined) brandNew = brandNew || this.set(v);
		}
		return brandNew;
	}

	/**
	 * Accessing a key would first check if the key is comparable or is there a comparator
	 * if not, it tries to convert it
	 */
	public has(v: number): boolean {
		if (this.root) return this.root.search(v) !== undefined;
	}

	/**
	 * Returns with the value on the supplied key. undefined if there is no value on that key
	 */
	public get(v: number): number {
		if (this.root) return this.root.search(v);
	}

	/**
	 * sets a value
	 */
	public set(v: number): boolean {
		let overwrite = false;
		if (!this.root) this.root = new SimpleNode(v);
		else overwrite = this.root.set(v);
		this.root = this.root.rebalance();
		this.root.updateHeight();
		return !overwrite;
	}

	/**
	 * Sets multiple values to multiple keys
	 */
	public put(...input: number[]): boolean {
		let brandNew = false;
		for (const v of input) {
			brandNew = brandNew || this.set(v);
		}
		return brandNew;
	}

	/**
	 * Returns the first element.
	 * Complexity: O(1)
	 */
	min(): number {
		return this.root ? this.root.first().v : undefined;
	}

	/**
	 * Returns the last element.
	 * Complexity: O(1)
	 */
	max(): number {
		return this.root ? this.root.last().v : undefined;
	}

	pop(): number {
		// remove and return max
		return undefined;
	}

	popFirst(): number {
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
	forEach(callback: (i: number, index?: number) => void): void {
		let i = 0;
		for (const item of this) {
			callback(item, i);
			i++;
		}
	}

	/**
	 * Iterate through the values in ascending order
	 */
	*[Symbol.iterator](): IterableIterator<number> {
		if (this.root) yield* this.root;
	}

	/**
	 * Complexity: O(n)
	 */
	toArray(): Array<number> {
		const arr: Array<number> = [];
		for (const v of this) arr.push(v);
		return arr;
	}

	toString(): string {
		let acc = '';
		for (const i of this) {
			acc += i.toString() + '\n';
		}
		return acc;
	}

	print(): void {
		console.log(this.toString());
	}
}
