import { Convertable } from './convertable.interface';
import { Comparable } from './comparable.interface';
export class Node<
	V extends number | string | Convertable<K> | any = number | string,
	K extends number | string | V | Comparable<K> = number | string
> {
	l: Node<V, K>;
	r: Node<V, K>;
	h: number;
	k: K;
	v: V;
	constructor(...init: { k: K; v: V }[]) {
		for (const { k, v } of init) Node.set(this, k, v);
	}

	/**
	 * Searches for a Node containing a key
	 */
	static search<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>, k: K, comparator?: (a: K, b: K) => number): V {
		if ((k as Comparable<K>).compareTo) {
			comparator = (k as Comparable<K>).compareTo;
		}
		if (
			node.k !== undefined &&
			((k as Comparable<K>).compareTo ? comparator.bind(k)(node.k) === 0 : node.k === k)
		) {
			return node.v as V;
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(node.k) < 0 : k < node.k) {
			if (node.l) return Node.search(node.l, k, comparator);
			else return undefined;
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(node.k) > 0 : k > node.k) {
			if (node.r) return Node.search(node.r, k, comparator);
			else return undefined;
		}
	}

	/**
	 * Sets the key to a specific value. Inserts the node in a key-order respecting manner
	 */
	static set<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>, k: K, v: V, comparator?: (a: K, b: K) => number): boolean {
		let overwrite = false;
		if ((k as Comparable<K>).compareTo) {
			comparator = (k as Comparable<K>).compareTo;
		}
		if (
			(node.k === undefined && node.v === undefined) ||
			((k as Comparable<K>).compareTo ? comparator.bind(k)(node.k) === 0 : node.k === k)
		) {
			node.k = k;
			node.v = v;
			overwrite = true;
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(node.k) < 0 : k < node.k) {
			if (node.l) return Node.set(node.l, k, v);
			else node.l = new Node<V, K>({ k, v });
		} else if ((k as Comparable<K>).compareTo ? comparator.bind(k)(node.k) > 0 : k > node.k) {
			if (node.r) return Node.set(node.r, k, v);
			else node.r = new Node<V, K>({ k, v });
		}
		Node.updateHeight(node);
		return overwrite;
	}

	/**
	 * Returns the first element.
	 * Complexity: O(1)
	 */
	static first<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): Node<V, K> {
		if (node.l) return Node.first(node.l);
		else return node;
	}

	/**
	 * Returns the last element.
	 * Complexity: O(1)
	 */
	static last<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): Node<V, K> {
		if (node.r) return Node.last(node.r);
		else return node;
	}

	/**
	 * Calculates the height of the node. A leafs (node without either a left or a right node) height is
	 */
	static updateHeight<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): void {
		node.h = 1 + Math.max(node.l ? node.l.h : 0, node.r ? node.r.h : 0);
	}

	/**
	 * Returns all the nodes below and including this
	 */

	static *nodes<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): IterableIterator<Node<V, K>> {
		if (node.l) yield* Node.nodes(node.l);
		yield node;
		if (node.r) yield* Node.nodes(node.r);
	}

	/**
	 * Generator function
	 * that returns all the values of the nodes below and this in an ascending order
	 */
	static *ascend<
		V extends number | string | Convertable<K> | any = number | string,
		K extends number | string | V | Comparable<K> = number | string
	>(node: Node<V, K>): IterableIterator<V> {
		if (node.l) yield* Node.ascend(node.l);
		if (node.k) yield node.v;
		if (node.r) yield* Node.ascend(node.r);
	}
	/*
	/**
	 * Generator function
	 * that returns all the values of the nodes below and this in an descending order

	*descend(): IterableIterator<V> {
		if (this.r) yield* this.r;
		if (this.k) yield this.v;
		if (this.l) yield* this.l;
	}
*/

	/**
	 * String representation of a node
	 */
	/*
	toString(): string {
		return `l: ${this.l ? this.l.k : '-'} {k: ${this.k} v: ${this.v}} r: ${this.r ? this.r.k : '-'} h: ${this.h}`;
	}*/
}
