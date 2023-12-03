import _ from 'lodash';
import path from 'path';
import { cwd } from 'node:process';

const makeAstTree = (beforeConfig, afterConfig) => {
  const fileKeys = _.union(_.keys(beforeConfig), _.keys(afterConfig));
  const sortFileKeys = fileKeys.sort();
  const result = sortFileKeys.map((key) => {
    if (!_.has(afterConfig, key)) {
      return { key, status: 'deleted', value: beforeConfig[key] };
    }
    if (!_.has(beforeConfig, key)) {
      return { key, status: 'added', value: afterConfig[key] };
    }
    const oldValue = beforeConfig[key];
    const newValue = afterConfig[key];
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

const findFile = (pathToFile, directory) => path.resolve(cwd(), directory, pathToFile);

export { makeAstTree, findFile };
