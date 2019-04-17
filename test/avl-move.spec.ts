import { expect } from 'chai';
import { Tree } from '../src/tree.class';
import { BasicComparable } from './model/basic-comparable.class';

describe('AVL Move tests', () => {
	let tree: Tree<BasicComparable, number>;
	beforeEach(() => {
		tree = new Tree<BasicComparable, number>();
		tree.set(new BasicComparable(1), 1);
		tree.set(new BasicComparable(2), 2);
		tree.set(new BasicComparable(3), 3);
		tree.set(new BasicComparable(4), 4);
	});

	it('should be able to keep its reference', () => {
		const originalNode = tree.getNode(new BasicComparable(3));
		const newKey = new BasicComparable(7);
		const result = tree.moveNode(originalNode.key, newKey);
		const resultNode = tree.getNode(newKey);
		expect(originalNode).to.equal(resultNode);
		expect(result).to.be.true;
	});

	it('should fail when moving to an existing key', () => {
		const originalNode = tree.getNode(new BasicComparable(3));
		const newKey = new BasicComparable(4);
		const result = tree.moveNode(originalNode.key, newKey);
		const resultNode = tree.getNode(newKey);
		expect(originalNode).to.not.equal(resultNode);
		expect(result).to.not.be.true;
	});
});
