import { expect } from 'chai';
import { Tree } from '../src/tree.class';

describe('AVL Number tests', () => {
	let tree: Tree;
	beforeEach(() => {
		tree = new Tree();
		tree.push(2);
		tree.push(1);
		tree.push(0);
		tree.push(3);
		tree.push(4);
	});

	it('should be able to remove a leaf', () => {
		const lengthBefore = tree.length;
		expect(tree.remove(0)).to.be.equal(0);
		expect(tree.remove(10)).to.be.not.ok;
		expect(tree.length).to.equal(lengthBefore - 1);
	});

	it('should be able to remove a middle node', () => {
		const lengthBefore = tree.length;
		expect(tree.remove(2)).to.be.equal(2);
		expect(tree.length).to.equal(lengthBefore - 1);
	});

	it('should be able to remove the root node', () => {
		const lengthBefore = tree.length;
		tree.remove(1);
		expect(tree.length).to.equal(lengthBefore - 1);
	});
});
