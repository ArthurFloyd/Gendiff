import { makeAstTree } from '../index.js';
import stylish from './stylish.js';
import plain from './plain.js';

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

export default genearateDiff;
