import { expect } from 'chai';
import { Tree } from '../main/tree.class';
import { BasicComparable } from './model/basic-comparable.class';

describe('Comparable tests', () => {
	let tree: Tree<any, BasicComparable>;
	beforeEach(() => {
		tree = new Tree<any, BasicComparable>();
		tree.push(new BasicComparable(1), 1);
		tree.push(new BasicComparable(2), 2);
		tree.push(new BasicComparable(3), 3);
		tree.push(new BasicComparable(4), 4);
	});

	it('should not be able to insert an already added object to the tree', () => {
		const lengthBeforeAdd = tree.length;
		tree.push(new BasicComparable(2));
		expect(tree.length).to.be.equal(lengthBeforeAdd);
	});

	it('should be able to check is a number is in the tree', () => {
		expect(tree.has(new BasicComparable(3))).to.be.ok;
	});

	it('should be able to check is a number is not the tree', () => {
		expect(tree.has(new BasicComparable(-3))).to.be.not.ok;
	});
});
