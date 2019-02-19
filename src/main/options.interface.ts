export interface Options<V, K> {
	converter?: (v: V) => K;
}
