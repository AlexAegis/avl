import { Tree } from './main/tree.class';
export { Comparable } from './main/comparable.interface';
export { Convertable } from './main/convertable.interface';

const tree = new Tree();
for (let i = 0; i < 100; i = i + 2) {
	tree.push(i);
}

for (let i = 101; i > 1; i = i - 2) {
	tree.push(i);
}

// tree.push(9);
// tree.push(1);
