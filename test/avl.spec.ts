import { expect } from 'chai';
import { Tree } from '../src/tree.class';

describe('AVL Tree', () => {
	it('should be constructable without generics', () => {
		const tree = new Tree();
		expect(tree).to.be.ok;
	});

	it('should be constructable with only key generic', () => {
		const tree = new Tree<number>();
		expect(tree).to.be.ok;
	});

	it('should be able to push numbers in', () => {
		const tree = new Tree();
		tree.push(1);
		tree.push(2);
		tree.push(3);
		tree.push(4);
		expect(tree.length).to.equal(4);
	});

	it('should be able to sort the numbers on push', () => {
		const tree = new Tree();
		tree.push(4);
		tree.push(2);
		tree.push(3);
		tree.push(1);
		let i = 1;
		for (const n of tree) {
			expect(n).to.equal(i);
			i++;
		}
	});
});
