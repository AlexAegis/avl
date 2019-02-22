export { Tree } from './main/tree.class';
export { Comparable } from './main/comparable.interface';
export { Convertable } from './main/convertable.interface';

const n = 8;
const min = Math.ceil(Math.log2(n + 1));
const max = Math.floor(1.44 * Math.log2(n + 2) - 0.328);
console.log(`n: ${n} min: ${min} max: ${max}`);
