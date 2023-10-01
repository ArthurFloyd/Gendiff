import { expect, test } from '@jest/globals';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import fs from 'fs';
import { genDiff } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

test('comparing two JSON files', () => {
  const txt = readFile('gendiff.txt').toString();
  const json1 = JSON.parse(readFile('file1.json'));
  const json2 = JSON.parse(readFile('file2.json'));
  console.log(txt, json1, json2, genDiff(json1, json2));
  expect(genDiff(json1, json2)).toBe(txt);
});
