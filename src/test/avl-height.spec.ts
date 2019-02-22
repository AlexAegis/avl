import { expect } from 'chai';
import { Tree } from '../main/tree.class';

describe('AVL Height tests', () => {
	const minHeight = (n: number) => Math.ceil(Math.log2(n + 1));
	const maxHeight = (n: number) => Math.floor(1.44 * Math.log2(n + 2) - 0.328);

	let tree: Tree;
	beforeEach(() => {
		tree = new Tree();
	});

	it('should stay between the allowed heights while plugging in a lot of numbers', () => {
		for (let i = -50; i <= 50; i = i + 2) {
			expect(tree.push(i)).to.be.true;
			expect(tree.height).to.be.gte(minHeight(tree.length));
			expect(tree.height).to.be.lte(maxHeight(tree.length));
		}

		for (let i = 51; i >= -50; i = i - 2) {
			expect(tree.push(i)).to.be.true;
			expect(tree.height).to.be.gte(minHeight(tree.length));
			expect(tree.height).to.be.lte(maxHeight(tree.length));
		}
	});
});
