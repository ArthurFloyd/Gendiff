// import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

// const __dirname = dirname(fileURLToPath(import.meta.url));
const extention = ['json', 'yml'];

describe('gendiff', () => {
  const stylishTestResult = fs.readFileSync(path.resolve('./__fixtures__/stylishTestResult.txt'), 'utf8');
  const plainTestResult = fs.readFileSync(path.resolve('./__fixtures__/plainTestResult.txt'), 'utf8');
  const jsonTestResult = fs.readFileSync(path.resolve('./__fixtures__/jsonTestResult.txt'), 'utf8');
  describe.each(extention)('compare two %s files', (ext) => {
    const before = path.resolve(`./__fixtures__/before.${ext}`);
    const after = path.resolve(`./__fixtures__/after.${ext}`);
    const expected = genDiff(before, after);
    console.log(`./__fixtures__/before.${ext}`);

    test('stylish', () => {
      expect(expected).toBe(stylishTestResult);
    });

    test('plain', () => {
      expect(genDiff(before, after, 'plain'))
        .toBe(plainTestResult);
    });

    test('json', () => {
      expect(genDiff(before, after, 'json'))
        .toBe(jsonTestResult);
    });
  });
});
