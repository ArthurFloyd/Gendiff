import _ from 'lodash';

const planValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return `${value}`;
};

const plain = (tree, parentKey = '') => {
  const result = tree
    .filter(({ status }) => status !== 'unchanged')
    .map(({
      key, value, status, oldValue, newValue, children,
    }) => {
      const newProperty = _.trim(`${parentKey}.${key}`, '.');
      switch (status) {
        case 'changed':
          return `Property '${newProperty}' was updated. From ${planValue(oldValue)} to ${planValue(newValue)}`;
        case 'added':
          return `Property '${newProperty}' was added with value: ${planValue(value)}`;
        case 'deleted':
          return `Property '${newProperty}' was removed`;
        case 'nested':
          return plain(children, newProperty);
        default:
          throw new Error(`Unknown node status ${status}`);
      }
    });
  return result.join('\n');
};

export default plain;
