import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import genearateDiff from '../src/formatters/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

const beforeJson = yaml.load(readFile('before.json'));
const afterJson = yaml.load(readFile('after.json'));

const beforeYaml = yaml.load(readFile('before.yml'));
const afterYaml = yaml.load(readFile('after.yml'));

const stylishTestResult = readFile('stylishTestResult.txt').toString();
const plainTestResult = readFile('plainTestResult.txt').toString();
const jsonTestResult = readFile('jsonTestResult.txt').toString();

test('comparing two json files in format stylish', () => {
  expect(genearateDiff(beforeJson, afterJson))
    .toBe(stylishTestResult);
});

test('comparing two yaml files in format stylish', () => {
  expect(genearateDiff(beforeYaml, afterYaml))
    .toBe(stylishTestResult);
});

test('comparing two json files in format plain', () => {
  expect(genearateDiff(beforeJson, afterJson, 'plain'))
    .toBe(plainTestResult);
});

test('comparing two yaml files in format plain', () => {
  expect(genearateDiff(beforeYaml, afterYaml, 'plain'))
    .toBe(plainTestResult);
});

test('comparing two json files in format json', () => {
  expect(genearateDiff(beforeJson, afterJson, 'json'))
    .toBe(jsonTestResult);
});

test('comparing two yaml files in format json', () => {
  expect(genearateDiff(beforeYaml, afterYaml, 'json'))
    .toBe(jsonTestResult);
});
