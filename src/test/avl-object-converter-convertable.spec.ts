import { expect } from 'chai';
import { Tree } from '../main/tree.class';
import { BasicConvertable } from './model/basic-convertable.class';

describe('Convertable Object tests', () => {
	let tree: Tree<BasicConvertable>;
	beforeEach(() => {
		tree = new Tree<BasicConvertable>();
		tree.push(new BasicConvertable(1));
		tree.push(new BasicConvertable(2));
		tree.push(new BasicConvertable(3));
		tree.push(new BasicConvertable(4));
	});

	it('should not be able to insert an already added number to the tree', () => {
		const lengthBeforeAdd = tree.length;
		tree.push(new BasicConvertable(1));
		expect(tree.length).to.be.equal(lengthBeforeAdd);
	});

	it('should be able to check if a number is in the tree', () => {
		expect(tree.has(3)).to.be.ok;
	});

	it('should be able to check if a convertible value is in the tree', () => {
		expect(tree.has(new BasicConvertable(4))).to.be.ok;
	});

	it('should be able to check if a number is not the tree', () => {
		expect(tree.has(-1)).to.be.not.ok;
	});
});
