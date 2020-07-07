import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';
import plugin from '../src';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Tranform all for-of loops into the equivalent array for loop', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).forEach((name) => {
    const dir = path.join(fixturesDir, name);
    fs.readdirSync(dir).forEach((caseName) => {
      it(`should ${name} ${caseName.split('-').join(' ')}`, () => {
        const fixtureDir = path.join(dir, caseName);
        const actualPath = path.join(fixtureDir, 'actual.js');
        const actual = transformFileSync(actualPath).code;

        const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js')
        ).toString();

        assert.equal(trim(actual), trim(expected));
      });
    });
  });
});
