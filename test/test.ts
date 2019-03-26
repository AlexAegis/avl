import { BasicConvertableToComparable } from './model/basic-convertable-to-comparable.class';
import { Coord } from './model/coord.class';
import { Tree } from '../src/tree.class';
import { BasicComparable } from './model/basic-comparable.class';

/*
const tree = new Tree<BasicComparable, number>();
tree.converter = (n: number) => new BasicComparable(1);
tree.set(new BasicComparable(1), 1);
tree.set(new BasicComparable(2), 2);
tree.set(new BasicComparable(3), 3);
tree.set(new BasicComparable(6), 4);
*/

const tree = new Tree<number, number>();
tree.set(1, 1);
tree.set(2, 2);
tree.set(3, 3);
tree.set(6, 4);

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
/*
console.log(`tree: ${tree.toArray()}`);
const stringTree = tree.stringify();
console.log(`stringTree: ${stringTree}`);

const parsedTree = Tree.parse(stringTree);
console.log(parsedTree.converter);
console.log(`parsedTree: ${parsedTree.toArray()}`);
console.log(`res2: ${JSON.stringify(parsedTree.height)}`);
const res = parsedTree.get(6);
console.log(`res: ${JSON.stringify(res)}`);

parsedTree.set(1, 9);
parsedTree.set(2, 9);
parsedTree.set(7, 9);

console.log(`parsedTree: ${parsedTree.toArray()}`);
console.log(`res2: ${JSON.stringify(parsedTree.height)}`);*/
console.log('a'.charCodeAt(0)); // 97

function hashString(s: string): number {
	return [...s].reduce((acc, next, i, array) => (acc += next.charCodeAt(0) * Math.pow(222, array.length - i - 1)), 0);
}
