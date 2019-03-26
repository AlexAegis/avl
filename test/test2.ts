import { BasicConvertableToComparable } from './model/basic-convertable-to-comparable.class';
import { Coord } from './model/coord.class';
import { Tree } from '../src/tree.class';
import { BasicComparable } from './model/basic-comparable.class';

const tree = new Tree<number, number>();
tree.set(1, 1);
tree.set(2, 2);
tree.set(4, 4);
tree.set(8, 8);
tree.set(7, 7);
tree.set(10, 10);
tree.set(14, 14);
tree.set(12, 12);

const enclosing = tree.enclosingNodes(13.66);
console.log(`enclosing.last: ${enclosing.last} enclosing.first: ${enclosing.first}`);
