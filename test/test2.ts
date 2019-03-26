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

const last = tree.lastBefore(13.66); // 12
const first = tree.firstFrom(13.66); // 14
const enclosing = tree.enclosing(13.66); // {last: 12, first: 14}

// When you might need the keys too
const lastNode = tree.lastNodeBefore(13.66); // Node {h: 1, k: 12, v: 12}
const firstNode = tree.firstNodeFrom(13.66); // Node {h: 2, k: 14, v: 14, …}
const enclosingNodes = tree.enclosingNodes(13.66); // Object {last: Node {h: 1, k: 12, v: 12}, first: Node {h: 2, k: 14, v: 14, …}}
