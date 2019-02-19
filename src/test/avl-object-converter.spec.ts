import { converter } from './model/converter.function';
import { expect } from 'chai';
import { Tree } from '../main/tree.class';
import { Basic } from './model/basic.class';

describe('Converter tests', () => {
	let tree: Tree<Basic>;
	beforeEach(() => {
		tree = new Tree<Basic>((basic: Basic) => basic.n);
		tree.push(new Basic(1));
		tree.push(new Basic(2));
		tree.push(new Basic(3));
		tree.push(new Basic(4));
	});

	it('should not be able to insert an already added object to the tree', () => {
		const lengthBeforeAdd = tree.length;
		tree.push(new Basic(2));
		expect(tree.length).to.be.equal(lengthBeforeAdd);
	});

	it('should be able to check is a number is in the tree', () => {
		expect(tree.has(3)).to.be.ok;
	});

	it('should be able to check is a number is not the tree', () => {
		expect(tree.has(-1)).to.be.not.ok;
	});
});
