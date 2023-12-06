import _ from 'lodash';

const stringify = (value, depth, replacer = '    ') => {
  if (!_.isObject(value)) {
    return `${value}`;
  }
  const valueSpaceCount = replacer.repeat(depth + 1);
  const line = Object.entries(value).map(([key, val]) => {
    const preparedValue = stringify(val, depth + 1);
    return `${valueSpaceCount}${key}: ${preparedValue}`;
  });
  const closeObjectSpaceCount = replacer.repeat(depth);
  return ['{', ...line, `${closeObjectSpaceCount}}`].join('\n');
};

const stylish = (diffTree, replacer = '    ', depth = 1) => {
  const initialIndent = replacer.repeat(depth).slice(2);
  const result = diffTree.flatMap(({
    key, value, status, oldValue, newValue, children,
  }) => {
    switch (status) {
      case 'nested':
        return `${initialIndent}  ${key}: ${stylish(children, replacer, depth + 1)}`;
      case 'added':
        return `${initialIndent}+ ${key}: ${stringify(value, depth)}`;
      case 'deleted':
        return `${initialIndent}- ${key}: ${stringify(value, depth)}`;
      case 'changed':
        return [
          `${initialIndent}- ${key}: ${stringify(oldValue, depth)}`,
          `${initialIndent}+ ${key}: ${stringify(newValue, depth)}`,
        ];
      case 'unchanged':
        return `${initialIndent}  ${key}: ${stringify(value, depth)}`;
      default:
        throw new Error(`Unknown status: '${status}'!`);
    }
  });
  const outRepeat = replacer.repeat(depth - 1);
  return ['{', ...result, `${outRepeat}}`].join('\n');
};

export default stylish;
