define(["foo"], function (_foo) {
  "use strict";

  for (let _i = 0, _length = _foo.array.length; _i < _length; _i++) {
    const elm = _foo.array[_i];
    console.log(elm);
  }
});