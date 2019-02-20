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
 * TODO: might be faster if all the tree operatons are on the tree and not the node
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
	 * Rebalances the tree below the node if the height differences are too big
	 */
	static rebalance<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): Node<V, K> {
		if (node.l) node.l = Tree.rebalance(node.l);
		if (node.r) node.r = Tree.rebalance(node.r);
		const lh = node.l ? node.l.h : 0;
		const rh = node.r ? node.r.h : 0;
		if (lh > rh + 1) {
			if ((node.l && node.l.l && node.l.l.h) || 0 > (node.l && node.l.r && node.l.r.h) || 0) {
				return Tree.rrotate<V, K>(node);
			} else return Tree.lrrotate<V, K>(node);
		} else if (rh > lh + 1) {
			if ((node.r && node.r.r && node.r.r.h) || 0 > (node.r && node.r.l && node.r.l.h) || 0) {
				return Tree.lrotate<V, K>(node);
			} else return Tree.rlrotate<V, K>(node);
		} else return node;
	}

	/**
	 * Performs a right-left rotation
	 */
	static rlrotate<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): Node<V, K> {
		node.r = Tree.rrotate<V, K>(node.r);
		return Tree.lrotate<V, K>(node);
	}

	/**
	 * Performs a left-right rotation
	 */
	static lrrotate<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): Node<V, K> {
		node.l = Tree.lrotate<V, K>(node.l);
		return Tree.rrotate<V, K>(node);
	}

	/**
	 * Performs a right rotation on the tree
	 */
	static rrotate<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): Node<V, K> {
		const root: Node<V, K> = node.l;
		node.l = root.r;
		root.r = node;
		Node.updateHeight(node);
		if (node.r) Node.updateHeight(node.r);
		Node.updateHeight(root);
		return root;
	}

	/**
	 * Performs a right rotation on the tree
	 */
	static lrotate<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): Node<V, K> {
		const root: Node<V, K> = node.r;
		node.r = root.l;
		root.l = node;
		Node.updateHeight(node);
		if (node.l) Node.updateHeight(node.l);
		Node.updateHeight(root);
		return root;
	}
	/**
	 * The push method tries to convert the value into a number to use it as a Key
	 * if it has a convertTo method (suggested, but not necessarily by the Convertable interface)
	 * it will use that. If not, but you've set a converter
	 */
	public push(...input: V[]): boolean {
		let brandNew = false;
		for (const v of input) {
			const k: K = this.convert(v as K);
			if (k !== undefined) brandNew = brandNew || this.set(k as K, v);
		}
		return brandNew;
	}

	/**
	 * Accessing a key would first check if the key is comparable or is there a comparator
	 * if not, it tries to convert it
	 */
	public has(k: K): boolean {
		if (!(k as Comparable<K>).compareTo && !this.comparator) {
			k = this.convert(k);
		}
		if (this.root) return Node.search(this.root, k, this.comparator) !== undefined;
	}

	/**
	 * Returns with the value on the supplied key. undefined if there is no value on that key
	 */
	public get(k: K): V {
		if (!(k as Comparable<K>).compareTo && !this.comparator) {
			k = this.convert(k);
		}
		if (this.root) return Node.search(this.root, k, this.comparator);
	}

	/**
	 * sets a key to a value
	 */
	public set(k: K, v: V): boolean {
		let overwrite = false;
		if (!this.root) this.root = new Node<V, K>({ k, v });
		else overwrite = Node.set(this.root, k, v, this.comparator);
		this.root = Tree.rebalance<V, K>(this.root);
		Node.updateHeight(this.root);
		return !overwrite;
	}

	/**
	 * Sets multiple values to multiple keys
	 */
	public put(...input: { k: K; v: V }[]): boolean {
		let brandNew = false;
		for (const { k, v } of input) {
			brandNew = brandNew || this.set(k, v);
		}
		return brandNew;
	}

	/**
	 * Returns the first element.
	 * Complexity: O(1)
	 */
	min(): V {
		return this.root ? Node.first(this.root).v : undefined;
	}

	/**
	 * Returns the last element.
	 * Complexity: O(1)
	 */
	max(): V {
		return this.root ? Node.last(this.root).v : undefined;
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

		if (k !== undefined) return k as K;

		throw new ConvertError();
	}

	/**
	 * Iterate through the values in ascending order
	 */
	*[Symbol.iterator](): IterableIterator<V> {
		if (this.root) yield* Node.ascend(this.root);
	} /*nodes(): IterableIterator<Node<V, K>> {
		if (this.root) yield* this.root.nodes();
	}*/
	/**
	 * Complexity: O(n)
	 */

	/**
	 * Iterate through the values in descending order
	 */
	/*descend(): IterableIterator<V> {
		if (this.root) yield* this.root.descend();
	}*/

	/**
	 * For debug purposes
	 *
	 * Complexity:
	 *  call: O(1), iterating through: O(n)
	 */
	/*private*/ toArray(): Array<V> {
		const arr: Array<V> = [];
		for (const v of this) arr.push(v);
		return arr;
	}

	toString(): string {
		let acc = '';
		for (const node of Node.nodes(this.root)) {
			acc += node.toString() + '\n';
		}
		return acc;
	}

	print(): void {
		console.log(this.toString());
	}
}
