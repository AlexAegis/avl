# [AVL Tree](https://en.wikipedia.org/wiki/AVL_tree)

[![Build Status](https://travis-ci.com/AlexAegis/avl.svg?branch=master)](https://travis-ci.com/AlexAegis/avl) [![npm (scoped)](https://img.shields.io/npm/v/@alexaegis/avl.svg?style=popout)](https://www.npmjs.com/package/@alexaegis/avl) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/35d7fb5b31c9407094abf49fc445cc48)](https://www.codacy.com/app/AlexAegis/avl?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/avl&utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/35161dd7d57e3759381a/maintainability)](https://codeclimate.com/github/AlexAegis/avl/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/35161dd7d57e3759381a/test_coverage)](https://codeclimate.com/github/AlexAegis/avl/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/AlexAegis/avl/badge.svg?targetFile=package.json)](https://snyk.io/test/github/AlexAegis/avl?targetFile=package.json) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Flexible [AVL Tree](./src/main/tree.class.ts) for TypeScript and JavaScript

## Usage

### Install with NPM

```bash
npm i @alexaegis/avl
```

### Import and Create

```TypeScript
import { Tree } from '@alexaegis/avl';

const tree = new Tree<Value, Key>(); // Create
tree.set(key, value); // Set
const result: Value = tree.get(key) // Get
```

## Using stricter types

Although the typing does not enforce the key to have a `compareTo` method (to allow using any type of object as keys, not just what you created and have control over) The tree will throw runtime errors if it can't order the keys.

> The most basic case is that the key is a string or a number, then the value itself can be directly converted to a string or a number (Implicit or explicit, either having a `convertTo(): K` method on the objects prototyle or supply a converter function to the Tree object), and then if the key is an object it has to be comparable (Implicit or explicit, either having a `comparable(a: K, b: K): number` method on the objects prototype or supply a converter function to the Tree object)

> These functions you supply will al have their this value bound to the object the are getting applied on. For this reason if you want to use `this` in you `comparator` and/or `converter` methods use regular functions instead of lambdas.

## Explicit keys - Comparable

if the object you are using as a key contains a compareTo(T) method then it will work just fine

```TypeScript
class Key {
	constructor(public key: number) {}
}
const tree = new Tree<Value, Key>();
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
const tree = new Tree<Value, Key>();
tree.set(new Key(2), new Value(4)); // 👌 the key will be valid
```

### Using a Comparator

```TypeScript
class Key {
	constructor(public key: number) {}
}

let tree = new Tree<Value, Key>((a: Key, b: Key) => a.key - b.key); // Using Lambdas
// Because of the inner binding you can even write this. It's basically the same
tree = new Tree<Value, Key>(function (other: Key) { return this.key - other.key; });

tree.set(new Key(2), new Value(4)); // 👌 the key will be valid
```

## Implicit keys - Convertable

> Only using implicit keys allows the usage of the push method!

```TypeScript
const tree = new Tree<Value>();
tree.push(new Value(4)); // Cannot convert error
```

### Using a convertable

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

### Using a converter

Alternatively you can supply a function to act as the converter

```TypeScript
export class Value {
    constructor(public n: number) {}
}
export class AnotherValue {
    constructor(public n: number) {}
}

const tree = new Tree<any>(undefined, () => this.n); // you can use this! (The first parameter is the comparator, we leave it as undefined now)
tree.push(new Value(4));
tree.push(new AnotherValue(1));  // You can do messy things like this without implementing a single interface

```

> For more examples check the [mocha tests](./src/test/)

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
