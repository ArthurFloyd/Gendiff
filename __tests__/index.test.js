import { expect, test } from '@jest/globals';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { genDiff } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

test('comparing two JSON files', () => {
  const txt = readFile('gendiff.txt');
  const json1 = JSON.parse(readFile('file1.json'));
  const json2 = JSON.parse(readFile('file2.json'));
  expect(genDiff(json1, json2)).toBe(txt.toString());
});
