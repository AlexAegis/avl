import { Tree } from './main/tree.class';
export { Comparable } from './main/comparable.interface';
export { Convertable } from './main/convertable.interface';

const tree = new Tree();
for (let i = 0; i < 10; i = i + 2) {
	tree.push(i);
}
tree.remove(8);
console.log('priont');
tree.print();
tree.push(9);
tree.push(1);

tree.remove(2);
console.log('priont');
tree.print();
tree.push(2);
tree.push(0);
tree.remove(6);
console.log('priont');
tree.print();
tree.remove(1);
console.log('priont');
tree.print();
