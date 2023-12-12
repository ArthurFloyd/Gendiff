import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { cwd } from 'node:process';
import render from './formatters/index.js';
import getParseFile from './parsers.js';

const makeAst = (beforeConfig, afterConfig) => {
  const fileKeys = _.sortBy(_.union(_.keys(beforeConfig), _.keys(afterConfig)));
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
      return { key, status: 'nested', children: makeAst(oldValue, newValue) };
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

const makeFileData = (pathToFile) => {
  const data = fs.readFileSync(path.resolve(cwd(), '__tests__', '__fixtures__', pathToFile));
  const format = _.trim(path.extname(pathToFile), '.');

  return { data, format };
};

const genDiff = (pathToFile1, pathToFile2, format) => {
  const beforeConfig = makeFileData(pathToFile1);
  const afterConfig = makeFileData(pathToFile2);

  const parseBefore = getParseFile(beforeConfig.format, beforeConfig.data);
  const parseAfter = getParseFile(afterConfig.format, afterConfig.data);

  const diffTree = makeAst(parseBefore, parseAfter);
  const result = render(diffTree, format);

  return result;
};

export default genDiff;
