import { expect } from 'chai';
import { Tree } from '../main/tree.class';

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

	it('should not be able to insert an already added number to the tree', () => {
		const lengthBeforeAdd = tree.length;
		tree.push(1);
		expect(tree.length).to.be.equal(lengthBeforeAdd);
	});

	it('should be able to check if a number is in the tree', () => {
		expect(tree.has(3)).to.be.ok;
	});

	it('should be able to return a number if its in the tree', () => {
		expect(tree.get(3)).to.be.ok;
		expect(tree.get(0)).to.equal(0);
	});

	it('should be able to return undefined if its not in the tree', () => {
		expect(tree.get(-1)).to.be.not.ok;
	});

	it('should be able to return the largest value', () => {
		expect(tree.max()).to.equal(4);
	});

	it('should be able to return the smallest value', () => {
		expect(tree.min()).to.equal(0);
	});

	it('should be able to return the smallest value even if its a negative', () => {
		tree.push(-1);
		tree.push(-3);
		tree.push(-2);
		expect(tree.min()).to.equal(-3);
	});
});
