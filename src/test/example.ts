import { Comparable } from './../main/comparable.interface';
import { Tree } from '../main/tree.class';

// Basic tree, numbers as keys, anything as value

// Tree with an explicit comparator

class Value {
	constructor(public val: number) {}
}

class Key {
	constructor(public key: number) {}
}

const tree = new Tree<any, Key>();
// Push would result in an error
// tree.push(new Value(4)); // Cannot convert, no sufficient conversion method. Either use a Convertable or supply a converter
tree.set(new Key(4), new Value(4)); // 👌
tree.set(new Key(2), new Value(2)); // 👌
tree.set(new Key(5), new Value(5)); // 👌
// using a key you can
