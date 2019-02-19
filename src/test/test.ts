import { BasicConvertable } from './model/basic-convertable.class';
import { Tree } from '..';

let tree: Tree<BasicConvertable>;

tree = new Tree<BasicConvertable>();
tree.push(new BasicConvertable(4));
tree.push(new BasicConvertable(2));
tree.push(new BasicConvertable(1));
tree.push(new BasicConvertable(3));

tree.print();
