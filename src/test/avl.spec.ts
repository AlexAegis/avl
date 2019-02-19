import { expect } from 'chai';
import { Tree } from '../main/tree.class';

describe('AVL Tree', () => {
	it('should be constructable without generics', () => {
		const tree = new Tree();
		expect(tree).to.be.ok;
	});

	it('should be constructable with only value generic', () => {
		const tree = new Tree<number>();
		expect(tree).to.be.ok;
	});

	it('should be constructable with only key generic', () => {
		const tree = new Tree<number, number>();
		expect(tree).to.be.ok;
	});
});
