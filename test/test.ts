import { BasicConvertableToComparable } from './model/basic-convertable-to-comparable.class';
import { Coord } from './model/coord.class';
import { Tree } from '../src/tree.class';
import { BasicComparable } from './model/basic-comparable.class';
import { jsonObject, jsonMember, JsonTypes, TypedJSON } from 'typedjson';
import 'reflect-metadata';
/*
const tree = new Tree<BasicComparable, number>();
tree.converter = (n: number) => new BasicComparable(1);
tree.set(new BasicComparable(1), 1);
tree.set(new BasicComparable(2), 2);
tree.set(new BasicComparable(3), 3);
tree.set(new BasicComparable(6), 4);
*/

const tree = new Tree<Coord, { h: number }>();
tree.converter = (n: { h: number }) => new Coord(n.h, n.h);
tree.set(new Coord(1, 2), { h: 1 });
tree.set(new Coord(2, 4), { h: 2 });
tree.set(new Coord(3, 1), { h: 3 });
tree.set(new Coord(6, 4), { h: 4 });

console.log(tree.converter);
// console.log(tree);
// console.log(tree.getFirstFrom(new BasicComparable(5)));

/*


const backTree = <Tree<BasicComparable, number>>JSON.parse(stringTree);

// console.log((backTree as Tree<BasicComparable, number>).getFirstFrom(new BasicComparable(5)));

const convAsString = JSON.stringify(tree.converter);

console.log(`convAsString: ${convAsString}`);

const parsedConverter: (value: number) => BasicComparable = JSON.parse(convAsString);
*/

console.log(`tree: ${tree.toArray()}`);
const stringTree = tree.stringify();
console.log(`stringTree: ${stringTree}`);

const parsedTree = TypedJSON.parse<Tree<Coord, Object>>(stringTree, Tree);
console.log(parsedTree.converter);
console.log(`parsedTree: ${parsedTree.toArray()}`);
console.log(`res2: ${JSON.stringify(parsedTree.height)}`);
const res = parsedTree.get(new Coord(6, 4));
console.log(`res: ${JSON.stringify(res)}`);

parsedTree.set(new Coord(6, 3), { h: 9 });
parsedTree.set(new Coord(6, 1), { h: 9 });
parsedTree.set(new Coord(6, 2), { h: 9 });

console.log(`parsedTree: ${parsedTree.toArray()}`);
console.log(`res2: ${JSON.stringify(parsedTree.height)}`);
