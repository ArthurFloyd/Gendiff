import _ from 'lodash';
import path from 'path';
import { cwd } from 'node:process';
import stylish from './formaters/stylish.js';
import plain from './formaters/plain.js';

const makeAstTree = (firstConfig, secondConfig) => {
  const keys = _.union(_.keys(firstConfig), _.keys(secondConfig));
  const sortKeys = keys.sort();
  const diffTree = [];
  sortKeys.forEach((key) => {
    if (_.isObject(firstConfig[key]) && _.isObject(secondConfig[key])) {
      diffTree.push({ key, value: makeAstTree(firstConfig[key], secondConfig[key]), status: 'nested' });
    } else if (!Object.hasOwn(firstConfig, key)) {
      diffTree.push({ key, value: secondConfig[key], status: 'added' });
    } else if (!Object.hasOwn(secondConfig, key)) {
      diffTree.push({ key, value: firstConfig[key], status: 'deleted' });
    } else if (firstConfig[key] !== secondConfig[key]) {
      diffTree.push({ key, value: [firstConfig[key], secondConfig[key]], status: 'changed' });
    } else if (firstConfig[key] === secondConfig[key]) {
      diffTree.push({ key, value: firstConfig[key], status: 'unchanged' });
    }
  });
  return diffTree;
};

const genearateDiff = (firstConfig = {}, secondConfig = {}, format = 'stylish') => {
  const diffTree = makeAstTree(firstConfig, secondConfig);
  switch (format) {
    case 'plain':
      return plain(diffTree);
    case 'stylish':
      return stylish(diffTree);
    case 'json':
      return JSON.stringify(diffTree, '', 1);
    default:
      throw new Error(`Unknown format: '${format}'!`);
  }
};

const findFile = (pathToFile, directory) => path.resolve(cwd(), directory, pathToFile);

export { genearateDiff, findFile };
