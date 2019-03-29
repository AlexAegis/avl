import { Constructor } from 'typedjson/js/typedjson/types';
import { Basic } from './model/basic.class';
import { BasicConvertableToComparable } from './model/basic-convertable-to-comparable.class';
import { Coord } from './model/coord.class';
import { Tree } from '../src/tree.class';
import { BasicComparable } from './model/basic-comparable.class';

const tree = new Tree<BasicComparable, Basic>();
tree.set(new BasicComparable(1546383600), new Basic(1)); // left
tree.set(new BasicComparable(1546470000), new Basic(2)); // root
tree.set(new BasicComparable(1546556400), new Basic(4)); // right
tree.set(new BasicComparable(1546642800), new Basic(5)); // right
console.log(tree);
console.log(tree.enclosingNodes(new BasicComparable(1546499400)));
console.log(tree);
/*
const tree2 = new Tree<Basic, Basic>((a, b) => a.n - b.n);
tree2.set(new Basic(0), new Basic(1));
tree2.set(new Basic(1), new Basic(2));
tree2.set(new Basic(2), new Basic(4));
tree2.set(new Basic(3), new Basic(5));
console.log(tree2.toArray().map(b => b.toString()));
console.log(`hasPrototype? ${tree2.comparator.prototype !== undefined} has can this bound? true`);
console.log(tree2.comparator.length);

const tree3 = new Tree<Basic, Basic>(function comp(a) {
	return this.n - a.n;
});
tree3.set(new Basic(0), new Basic(1));
tree3.set(new Basic(1), new Basic(2));
tree3.set(new Basic(2), new Basic(4));
tree3.set(new Basic(3), new Basic(5));
console.log(tree3.toArray().map(b => b.toString()));
console.log(`hasPrototype? ${tree3.comparator.prototype !== undefined} has can this bound? false`);
console.log(tree3.comparator.length);
const tree4 = new Tree<BasicComparable, Basic>(BasicComparable.prototype.compareTo);
tree4.set(new BasicComparable(0), new Basic(1));
tree4.set(new BasicComparable(1), new Basic(2));
tree4.set(new BasicComparable(2), new Basic(4));
tree4.set(new BasicComparable(3), new Basic(5));
console.log(tree4.toArray().map(b => b.toString()));
console.log(`hasPrototype? ${tree4.comparator.prototype !== undefined} has can this bound? true`);
console.log(tree4.comparator.length);
*/
/*


const treeAsString = JSON.stringify(tree);

console.log(treeAsString);

const redone = Tree.parse<BasicComparable, Basic>(treeAsString, BasicComparable, Basic);

console.log(redone);
for (const val of redone) {
	console.log(val.toString());
}
*/
