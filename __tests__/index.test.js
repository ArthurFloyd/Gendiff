import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const cases = [
  ['before.json', 'after.json', 'stylishTestResult.txt'],
  ['before.yml', 'after.yml', 'stylishTestResult.txt'],
  ['before.json', 'after.json', 'stylishTestResult.txt', 'stylish'],
  ['before.yml', 'after.yml', 'stylishTestResult.txt', 'stylish'],
  ['before.json', 'after.json', 'plainTestResult.txt', 'plain'],
  ['before.yml', 'after.yml', 'plainTestResult.txt', 'plain'],
  ['before.json', 'after.json', 'jsonTestResult.txt', 'json'],
  ['before.yml', 'after.yml', 'jsonTestResult.txt', 'json'],
];

describe('gendiff', () => {
  describe.each(cases)(
    'Compare %s and %s to expect %s in format',
    (beforeConfig, afterConfig, result, format) => {
      const before = getFixturePath(beforeConfig);
      const after = getFixturePath(afterConfig);
      const expected = readFile(result);
      const diff = genDiff(before, after, format);

      test(`compare two files ${format || 'no'} format`, () => {
        expect(diff).toBe(expected);
      });
    },
  );
});
