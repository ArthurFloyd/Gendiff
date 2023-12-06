import _ from 'lodash';
import path from 'path';
import { cwd } from 'node:process';
import fs from 'fs';
import render from './formatters/index.js';
import getParseFile from './parsers.js';

const makeAstTree = (beforeConfig, afterConfig) => {
  const fileKeys = _.union(_.keys(beforeConfig), _.keys(afterConfig)).sort();
  const result = fileKeys.map((key) => {
    const oldValue = beforeConfig[key];
    const newValue = afterConfig[key];
    if (!_.has(afterConfig, key)) {
      return { key, status: 'deleted', value: oldValue };
    }
    if (!_.has(beforeConfig, key)) {
      return { key, status: 'added', value: newValue };
    }
    if (oldValue === newValue) {
      return { key, status: 'unchanged', value: oldValue };
    }
    if (_.isObject(oldValue) && _.isObject(newValue)) {
      return { key, status: 'nested', children: makeAstTree(oldValue, newValue) };
    }
    const modifiedNode = {
      key,
      status: 'changed',
      oldValue,
      newValue,
    };
    return modifiedNode;
  });
  return result;
};

const makeFileData = (pathToFile, directory) => {
  const data = fs.readFileSync(path.resolve(cwd(), directory, pathToFile));
  const format = _.trim(path.extname(pathToFile), '.');

  return { data, format };
};

const genDiff = (pathToFile1, pathToFile2, format) => {
  const beforeConfig = makeFileData(pathToFile1, '__fixtures__');
  const afterConfig = makeFileData(pathToFile2, '__fixtures__');

  const parseBefore = getParseFile(beforeConfig.format, beforeConfig.data);
  const parseAfter = getParseFile(afterConfig.format, afterConfig.data);

  const diffTree = makeAstTree(parseBefore, parseAfter);
  const result = render(diffTree, format);

  return result;
};

export default genDiff;
