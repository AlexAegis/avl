import { Coord } from './model/coord.class';
import { expect } from 'chai';
import { Tree } from '../main/tree.class';
import { Basic } from './model/basic.class';
import { ConvertError } from '../main/convert.error';

describe('Comparable tests', () => {
	let tree: Tree<Basic, Coord>;
	beforeEach(() => {
		tree = new Tree<Basic, Coord>();
		tree.set(new Coord(7, 5), new Basic(7));
		tree.set(new Coord(4, 1), new Basic(3));
		tree.set(new Coord(1, 3), new Basic(6));
		tree.set(new Coord(3, 2), new Basic(5));
		tree.set(new Coord(2, 1), new Basic(2));
		tree.set(new Coord(1, 1), new Basic(1));
		tree.set(new Coord(5, 1), new Basic(4));
	});

	it('should not be able to use push when the value is not convertable or primitive and there is no converter', () => {
		expect(tree.push.bind(tree, new Basic(2))).to.throw(ConvertError);
	});

	it('should be able to remove an element with no children', () => {
		expect(tree.remove(new Coord(1, 1)).n).to.be.equal(1);
		expect(tree.length).to.be.equal(6);
	});

	it('should be able to remove an element with two children', () => {
		expect(tree.remove(new Coord(1, 3)).n).to.be.equal(6);
		expect(tree.length).to.be.equal(6);
	});

	it('should be able to remove an element with one children', () => {
		expect(tree.remove(new Coord(2, 1)).n).to.be.equal(2);
		expect(tree.length).to.be.equal(6);
	});

	it('should be in reading order', () => {
		let i = 1;
		for (const n of tree) {
			expect(n.n).to.equal(i);
			i++;
		}
	});

	it('should stay in reading order even when using the forEach loop', () => {
		let i = 1;
		tree.forEach((v, index) => {
			expect(v.n).to.equal(i);
			expect(index + 1).to.equal(i);
			i++;
		});
	});

	it('should stay in reading order after converted to an array', () => {
		let i = 1;
		for (const n of tree.toArray()) {
			expect(n.n).to.equal(i);
			i++;
		}
	});

	it('should be in reversed reading order when using the reverse generator', () => {
		let i = 7;
		for (const n of tree.reverse()) {
			expect(n.n).to.equal(i);
			i--;
		}
	});

	it('should stay in reversed reading order even when using the forEachReversed loop', () => {
		let i = 7;
		tree.forEachReversed((v, index) => {
			expect(v.n).to.equal(i);
			expect(7 - index).to.equal(i);
			i--;
		});
	});
});
