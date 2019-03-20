import { BasicConvertableToComparable } from './model/basic-convertable-to-comparable.class';
import { Coord } from './model/coord.class';
import { expect } from 'chai';
import { Tree } from '../src/tree.class';
import { Basic } from './model/basic.class';
import { ConvertError } from '../src/error/convert.error';

describe('Coord tests', () => {
	let tree: Tree<Coord, BasicConvertableToComparable>;
	const object = new BasicConvertableToComparable(new Coord(1, 1));
	beforeEach(() => {
		tree = new Tree<Coord, BasicConvertableToComparable>();
	});

	it('should be able to push in an object thats key is encapsulated in the stored object', () => {
		tree.push(new BasicConvertableToComparable(new Coord(1, 2)));
		tree.push(new BasicConvertableToComparable(new Coord(1, 3)));
		tree.push(new BasicConvertableToComparable(new Coord(1, 4)));
		tree.push(new BasicConvertableToComparable(new Coord(1, 5)));
		tree.push(object);
		tree.push(new BasicConvertableToComparable(new Coord(1, 6)));
		tree.push(new BasicConvertableToComparable(new Coord(1, 7)));
		expect(tree.get(new Coord(1, 1))).to.equal(object);
		expect(tree.length).to.equal(7);
	});
});
