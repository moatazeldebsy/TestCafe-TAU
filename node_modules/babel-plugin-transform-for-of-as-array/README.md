# babel-plugin-transform-for-of-as-array

Transform all for-of loops into the equivalent array for loop

## Example

**In**

```js
const array = [1, 2, 3];
for (const elm of array) {
  console.log(elm);
}

let item;
for ({ item } of array.map(item => ({ item }))) {
  console.log(item);
}
```

**Out**

```js
const array = [1, 2, 3];

for (let _i = 0, _length = array.length; _i < _length; _i++) {
  const elm = array[_i];
  console.log(elm);
}

let item;
for (let _i2 = 0, _array$map = array.map(item => ({ item })), _length2 = _array$map.length; _i2 < _length2; _i2++) {
  ({ item } = _array$map[_i2]);

  console.log(item);
}
```


## `loose` transformation

In addition to the normal transform, we also support a null-ish checking `loose` transform. Passing `{ loose: true }` option into the plugin enables it:

**In**

```js
const array = null;
for (const elm of array) {
  console.log(elm);
}

let item;
for ({ item } of array.map(item => ({ item }))) {
  console.log(item);
}
```

**Out**

```js
const array = null;

for (let _i = 0, _length = array == null ? 0 : array.length; _i < _length; _i++) {
  const elm = array[_i];
  console.log(elm);
}

let item;
for (let _i2 = 0, _array$map = array.map(item => ({ item })), _length2 = _array$map == null ? 0 : _array$map.length; _i2 < _length2; _i2++) {
  ({ item } = _array$map[_i2]);

  console.log(item);
}
```


## Installation

```sh
$ npm install babel-plugin-transform-for-of-as-array
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-for-of-as-array"]
}
```

### Via CLI

```sh
$ babel --plugins transform-for-of-as-array script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-for-of-as-array"]
});
```
