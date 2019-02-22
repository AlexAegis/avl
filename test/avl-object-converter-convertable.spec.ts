import { BasicConvertable } from './model/basic-convertable.class';
import { expect } from 'chai';
import { Tree } from '../src/tree.class';

describe('Bad Converter and Convertable tests, where the interface takes priority', () => {
	let tree: Tree<any, BasicConvertable>;
	beforeEach(() => {
		tree = new Tree<any, BasicConvertable>(undefined, bc => this.n);
		tree.push(new BasicConvertable(1));
		tree.push(new BasicConvertable(2));
		tree.push(new BasicConvertable(3));
		tree.push(new BasicConvertable(4));
	});

	it('should not be able to insert an already added object to the tree', () => {
		const lengthBeforeAdd = tree.length;
		tree.push(new BasicConvertable(2));
		expect(tree.length).to.be.equal(lengthBeforeAdd);
	});

	it('should be able to check is a number is in the tree', () => {
		expect(tree.has(3)).to.be.ok;
	});

	it('should be able to check is a number is not the tree', () => {
		expect(tree.has(-1)).to.be.not.ok;
	});
});
