import { expect } from 'chai';
import { Tree } from '../main/tree.class';
import { BasicComparable } from './model/basic-comparable.class';
import { Basic } from './model/basic.class';

describe('Comparable tests', () => {
	let tree: Tree<any, BasicComparable>;
	beforeEach(() => {
		tree = new Tree<any, BasicComparable>();
		tree.set(new BasicComparable(1), 1);
		tree.set(new BasicComparable(2), 2);
		tree.set(new BasicComparable(3), 3);
		tree.set(new BasicComparable(4), 4);
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

	it('should be able to put mutliple value at once using the put method', () => {
		const val = [
			{ key: new BasicComparable(-10), value: -10 },
			{ key: new BasicComparable(-20), value: -20 },
			{ key: new BasicComparable(-30), value: -30 },
			{ key: new BasicComparable(-40), value: -40 },
			{ key: new BasicComparable(-50), value: -50 },
			{ key: new BasicComparable(50), value: 50 },
			{ key: new BasicComparable(40), value: 40 },
			{ key: new BasicComparable(30), value: 30 },
			{ key: new BasicComparable(20), value: 20 },
			{ key: new BasicComparable(10), value: 10 }
		];
		expect(tree.put(...val)).to.be.true;
	});

	it('should be return false when even one of the keys is a duplicate', () => {
		const val = [
			{ key: new BasicComparable(-10), value: -10 },
			{ key: new BasicComparable(-20), value: -20 },
			{ key: new BasicComparable(-30), value: -30 },
			{ key: new BasicComparable(-40), value: -40 },
			{ key: new BasicComparable(50), value: -50 },
			{ key: new BasicComparable(50), value: 50 },
			{ key: new BasicComparable(40), value: 40 },
			{ key: new BasicComparable(30), value: 30 },
			{ key: new BasicComparable(20), value: 20 },
			{ key: new BasicComparable(10), value: 10 }
		];
		expect(tree.put(...val)).to.be.false;
	});
});
