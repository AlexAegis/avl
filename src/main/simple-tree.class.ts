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
	 * Rebalances the tree below the node if the height differences are too big
	 */
	static rebalance(node: SimpleNode): SimpleNode {
		if (node.l) node.l = SimpleTree.rebalance(node.l);
		if (node.r) node.r = SimpleTree.rebalance(node.r);
		const lh = node.l ? node.l.h : 0;
		const rh = node.r ? node.r.h : 0;
		if (lh > rh + 1) {
			if ((node.l && node.l.l && node.l.l.h) || 0 > (node.l && node.l.r && node.l.r.h) || 0) {
				return SimpleTree.rrotate(node);
			} else return SimpleTree.lrrotate(node);
		} else if (rh > lh + 1) {
			if ((node.r && node.r.r && node.r.r.h) || 0 > (node.r && node.r.l && node.r.l.h) || 0) {
				return SimpleTree.lrotate(node);
			} else return SimpleTree.rlrotate(node);
		} else return node;
	}

	/**
	 * Performs a right-left rotation
	 */
	static rlrotate(node: SimpleNode): SimpleNode {
		node.r = SimpleTree.rrotate(node.r);
		return SimpleTree.lrotate(node);
	}

	/**
	 * Performs a left-right rotation
	 */
	static lrrotate(node: SimpleNode): SimpleNode {
		node.l = SimpleTree.lrotate(node.l);
		return SimpleTree.rrotate(node);
	}

	/**
	 * Performs a right rotation on the tree
	 */
	static rrotate(node: SimpleNode): SimpleNode {
		const root: SimpleNode = node.l;
		node.l = root.r;
		root.r = node;
		node.updateHeight();
		if (node.r) node.r.updateHeight();
		root.updateHeight();
		return root;
	}

	/**
	 * Performs a right rotation on the tree
	 */
	static lrotate(node: SimpleNode): SimpleNode {
		const root: SimpleNode = node.r;
		node.r = root.l;
		root.l = node;
		node.updateHeight();
		if (node.l) node.l.updateHeight();
		root.updateHeight();
		return root;
	}

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
		this.root = SimpleTree.rebalance(this.root);
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
