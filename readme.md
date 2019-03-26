# [AVL Tree](https://en.wikipedia.org/wiki/AVL_tree)

[![Build Status](https://travis-ci.com/AlexAegis/avl.svg?branch=master)](https://travis-ci.com/AlexAegis/avl) [![npm (scoped)](https://img.shields.io/npm/v/@alexaegis/avl.svg?style=popout)](https://www.npmjs.com/package/@alexaegis/avl) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/35d7fb5b31c9407094abf49fc445cc48)](https://www.codacy.com/app/AlexAegis/avl?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/avl&utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/35161dd7d57e3759381a/maintainability)](https://codeclimate.com/github/AlexAegis/avl/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/35161dd7d57e3759381a/test_coverage)](https://codeclimate.com/github/AlexAegis/avl/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/AlexAegis/avl/badge.svg?targetFile=package.json)](https://snyk.io/test/github/AlexAegis/avl?targetFile=package.json) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Flexible [AVL Tree](./src/main/tree.class.ts) for TypeScript and JavaScript

### Install with NPM

```bash
npm i @alexaegis/avl
```

### Import and Create

```TypeScript
import { Tree } from '@alexaegis/avl';

const tree = new Tree<Key, Value>(); // Create
tree.set(key, value); // Set
const result: Value = tree.get(key) // Get
```

## Usage

Although the typing does not enforce the key to have a `compareTo` method (to allow using any type of object as keys, not just what you created and have control over) The tree will throw runtime errors if it can't order the keys.

> The most basic case is that the key is a string or a number, then the value itself can be directly converted to a string or a number (Implicit or explicit, either having a `convertTo(): K` method on the objects prototyle or supply a converter function to the Tree object), and then if the key is an object it has to be comparable (Implicit or explicit, either having a `comparable(a: K, b: K): number` method on the objects prototype or supply a converter function to the Tree object)

> These functions you supply will al have their this value bound to the object the are getting applied on. For this reason if you want to use `this` in you `comparator` and/or `converter` methods use regular functions instead of lambdas.

## Implicit keys - Comparable, Comparator

if the object you are using as a key contains a compareTo(T) method then it will work just fine

```TypeScript
class Key {
	constructor(public key: number) {}
}
const tree = new Tree<Key, Value>();
tree.set(new Key(2), new Value(4)); // Cannot compare error
```

### Using a Comparable

```TypeScript
class Key implements Comparable<Key> {
	constructor(public key: number) {}
	compareTo(other: Key): number {
		return this.key - other.key;
	}
}
const tree = new Tree<Key, Value>();
tree.set(new Key(2), new Value(4)); // 👌 the key will be valid
```

### Using a Comparator

Very important, if using a lambda as a comparator you cant use the `this` keyword in it (as usual),
and the only type of comparator you can write is the 'two argumen' one as seen below.
But you can use this if you use a regular anonym function. This will act the same as the one you
would write while implementing the interface. There is an optional second argument here too, that's gonna be the same as a. But you don't need to use it.

```TypeScript
class Key {
	constructor(public key: number) {}
}

let tree = new Tree<Key, Value>((a: Key, b: Key) => a.key - b.key); // Using Lambdas
// Because of the fancy inner binding, you can even write this. It's basically the same
tree = new Tree<Key, Value>(function (b: Key) { return this.key - b.key; });

tree.set(new Key(2), new Value(4)); // 👌 the key will be valid
```

## Explicit keys - Convertable, Converter

### Using a Convertable

> Only using Converters/Convertables allows the usage of the push method! You can even convert to a comparable!

```TypeScript
const tree = new Tree<Value>();
tree.push(new Value(4)); // Cannot convert error
```

```TypeScript
export class Value implements Convertable {
    constructor(public n: number) {}
	convertTo(): number | string {
		return this.n;
	}
}

const tree = new Tree<Value>();
tree.push(new Value(4)); // 👌 the key will be 4

```

### Using a Converter

Alternatively you can supply a function to act as the converter

```TypeScript
export class Value {
    constructor(public n: number) {}
}
export class AnotherValue {
    constructor(public n: number) {}
}

const tree = new Tree<number, Value>(undefined, (val: Value) => val.n);
tree.push(new Value(4));
tree.push(new AnotherValue(1)); // You can do messy things like this without implementing a single interface

```

### Using a Convertable that converts to a Comparable

This is great when you have a bunch of objects you want to quickly access by keys that are encapsulated within the object.

```TypeScript
export class Coord implements Comparable<Coord> {
	constructor(public x: number = 0, public y: number = 0) {}
	compareTo(other: Coord): number {
		return this.y === other.y ? this.x - other.x : this.y - other.y;
	}
}

export class BasicConvertableToComparable implements Convertable<Coord> {
	constructor(private coord: Coord) {}
	convertTo(): Coord {
		return this.coord;
	}
}

const tree: Tree<Coord, BasicConvertableToComparable>;
tree.push(new BasicConvertableToComparable(new Coord(1, 1)));
tree.get(new Coord(1, 1)); // The BasicConvertableToComparable object you pushed in

```

### Searching nearest values for missing keys

You can search for either nearest on left and nearest on right values if the one you search for might be missing.

```typescript
const tree = new Tree<number, number>();
tree.set(1, 1);
tree.set(2, 2);
tree.set(4, 4);
tree.set(8, 8);
tree.set(7, 7);
tree.set(10, 10);
tree.set(14, 14);
tree.set(12, 12);

const last = tree.lastBefore(13.66); // 12
const first = tree.firstFrom(13.66); // 14
const enclosing = tree.enclosing(13.66); // {last: 12, first: 14}

// When you might need the keys too
const lastNode = tree.lastNodeBefore(13.66); // Node {h: 1, k: 12, v: 12}
const firstNode = tree.firstNodeFrom(13.66); // Node {h: 2, k: 14, v: 14, …}
const enclosingNodes = tree.enclosingNodes(13.66); // Object {last: Node {h: 1, k: 12, v: 12}, first: Node {h: 2, k: 14, v: 14, …}}
```

For more examples check the [mocha tests](./src/test/)

---

## Technologies

### [Node 10](https://nodejs.org/en/)

> **JavaScript** runtime

### [NPM](https://www.npmjs.com/)

> **Package manager** for Node

### [TypeScript](https://www.typescriptlang.org/)

> **Typed superset** of JavaScript

### [TSLint](https://palantir.github.io/tslint/)

> **Linting** tool

### [Mocha](https://mochajs.org/)

> **Behaviour driven testing** framework

### [Chai](https://www.chaijs.com/)

> **Assertion** library

### [Istanbul](https://istanbul.js.org/)

> **Code coverage** tool

## Recommendations

### [Visual Studio Code](https://code.visualstudio.com/)

> **IDE** for everything. [Settings](./.vscode/)

### [Fira Code](https://github.com/tonsky/FiraCode)

> **Font** with ligatures

## Services

### [Travis CI](https://travis-ci.com/)

> **Continuous Integration** solution

### [Codacy](https://codacy.com/)

> **Code Quality** monitoring

### [Code Climate](https://codeclimate.com/)

> **Maintainability and Coverage** reports

### [Snyk](https://snyk.io/)

> **Vulnerability** detection

### [Shields.io](https://shields.io/#/)

> **Badges** to look cool
