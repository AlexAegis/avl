import { Comparable } from './../main/comparable.interface';
import { Tree } from '../main/tree.class';

// Basic tree, numbers as keys, anything as value

// Tree with an explicit comparator
/*
class Value {
	constructor(public value: number) {}
}

class Key {
	constructor(public key: number) {}
}

class KeyComp implements Comparable<KeyComp> {
	constructor(public key: number) {}
	compareTo(other: KeyComp): number {
		return this.key - other.key;
	}
}

const lambdaComp = (a: Key, b: Key) => {
	console.log(`lambComp a.key: ${a.key}`);
	console.log(`lambComp b.key: ${b.key}`);
	return a.key - b.key;
};

const funcComp = function(a: Key) {
	console.log(`funcComp this.key: ${this.key}`);
	console.log(`funcComp a.key: ${a.key}`);
	return this.key - a.key;
};

const tree = new Tree<Key, Value>(funcComp); // Using Lambdas
// Because of the inner binding you can even write this. It's basically the same

tree.set(new Key(2), new Value(4)); // 👌 the key will be valid
tree.set(new Key(3), new Value(5)); // 👌 the key will be valid,

for (const val of tree) {
	console.log(val.value);
}

const treeComp = new Tree<KeyComp, Value>(); // Using Lambdas
// Because of the inner binding you can even write this. It's basically the same

treeComp.set(new KeyComp(2), new Value(4)); // 👌 the key will be valid
treeComp.set(new KeyComp(3), new Value(5)); // 👌 the key will be valid,

for (const val of treeComp) {
	// console.log(val.value);
}

const keyA = new Key(2);
const keyB = new Key(3);

for (const fun of [funcComp, lambdaComp]) {
	fun.apply(keyA, fun.prototype ? [keyB, keyA] : [keyA, keyB]);
}*/

export class Value {
	constructor(public n: number) {}
}
export class AnotherValue {
	constructor(public n: number) {}
}

const tree = new Tree<any, Value>(undefined, (val: Value) => val.n);
tree.push(new Value(4));
tree.push(new AnotherValue(1));
tree.print();
