import _ from 'lodash';
import path from 'path';
import { cwd } from 'node:process';

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

const findFile = (pathToFile, directory) => path.resolve(cwd(), directory, pathToFile);

export { makeAstTree, findFile };
