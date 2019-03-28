import { Constructor } from 'typedjson/js/typedjson/types';
import { Basic } from './model/basic.class';
import { BasicConvertableToComparable } from './model/basic-convertable-to-comparable.class';
import { Coord } from './model/coord.class';
import { Tree } from '../src/tree.class';
import { BasicComparable } from './model/basic-comparable.class';

const tree = new Tree<number, Basic>();
tree.set(1, new Basic(1));
tree.set(2, new Basic(2));
tree.set(4, new Basic(4));

const treeAsString = JSON.stringify(tree);

console.log(treeAsString);

const redone = Tree.parse<number, Basic>(treeAsString, undefined, Basic);

console.log(redone);
for (const val of redone) {
	console.log(val.toString());
}
