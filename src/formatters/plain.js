import _ from 'lodash';

const planValue = (value) => {
  switch (true) {
    case value === null:
      return value;
    case typeof value === 'object':
      return '[complex value]';
    case typeof value === 'string':
      return `'${value}'`;
    default:
      return value;
  }
};

const plain = (tree, parentKey = '') => {
  const result = tree
    .filter((node) => node.status !== 'unchanged')
    .map((node) => {
      const newProperty = _.trim(`${parentKey}.${node.key}`, '.');
      switch (node.status) {
        case 'changed':
          return `Property '${newProperty}' was updated. From ${planValue(node.oldValue)} to ${planValue(node.newValue)}`;
        case 'added':
          return `Property '${newProperty}' was added with value: ${planValue(node.value)}`;
        case 'deleted':
          return `Property '${newProperty}' was removed`;
        case 'nested':
          return plain(node.children, newProperty);
        default:
          throw new Error(`Unknown node status ${node.status}`);
      }
    });
  return result.join('\n');
};

export default plain;
