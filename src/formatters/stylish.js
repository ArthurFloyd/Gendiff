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
  const result = diffTree.flatMap((node) => {
    switch (node.status) {
      case 'nested':
        return `${initialIndent}  ${node.key}: ${stylish(node.children, replacer, depth + 1)}`;
      case 'added':
        return `${initialIndent}+ ${node.key}: ${stringify(node.value, depth)}`;
      case 'deleted':
        return `${initialIndent}- ${node.key}: ${stringify(node.value, depth)}`;
      case 'changed':
        return [
          `${initialIndent}- ${node.key}: ${stringify(node.oldValue, depth)}`,
          `${initialIndent}+ ${node.key}: ${stringify(node.newValue, depth)}`,
        ];
      case 'unchanged':
        return `${initialIndent}  ${node.key}: ${stringify(node.value, depth)}`;
      default:
        throw new Error(`Unknown status: '${node.status}'!`);
    }
  });
  const outRepeat = replacer.repeat(depth - 1);
  return ['{', ...result, `${outRepeat}}`].join('\n');
};

export default stylish;
