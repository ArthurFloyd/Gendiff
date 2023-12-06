import stylish from './stylish.js';
import plain from './plain.js';

export default (diffTree, format = 'stylish') => {
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
