import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { genDiff, stylish } from '../testaaaa.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

test('comparing two flat files', () => {
  const txt = readFile('flat.txt').toString();
  const json1 = JSON.parse(readFile('file1.json'));
  const json2 = JSON.parse(readFile('file2.json'));
  expect(stylish(genDiff(json1, json2))).toBe(txt);
});

test('comparing two nested files', () => {
  const txt = readFile('nested.txt').toString();
  const yaml1 = yaml.load(readFile('file1.yml'));
  const yaml2 = yaml.load(readFile('file2.yml'));
  expect(stylish(genDiff(yaml1, yaml2))).toBe(txt);
});

test('comparing two files in format plain', () => {
  const txt = readFile('plain.txt').toString();
  const yaml1 = yaml.load(readFile('file1.yml'));
  const yaml2 = yaml.load(readFile('file2.yml'));
  expect(stylish(genDiff(yaml1, yaml2))).toBe(txt);
});
