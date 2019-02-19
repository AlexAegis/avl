export interface Options<V, K> {
	converter?: (v: V) => K;
	comparator?: (a: K, b: K) => number;
}
