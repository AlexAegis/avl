import { expect } from 'chai';
import { AVL } from './avl.class';

describe('AVL Tree', () => {
	it('should be constructable without generics', () => {
		let tree = new AVL.Tree();
		expect(tree).to.be.ok;
	});

	it('should be constructable with only value generic', () => {
		let tree = new AVL.Tree<number>();
		expect(tree).to.be.ok;
	});

	it('should be constructable with only key generic', () => {
		let tree = new AVL.Tree<number, number>();

		expect(tree).to.be.ok;
	});
});
