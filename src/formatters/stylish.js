import _ from 'lodash';

const stylish = (diffTree, replacer = '    ', spacesCount = 1) => {
  const iter = (data, depth) => {
    if (!_.isObject(data)) {
      return `${data}`;
    }
    const repeat = replacer.repeat(depth + 1);
    const line = Object.entries(data).map(([key, val]) => {
      const preparedValue = iter(val, depth + 1);
      return `${repeat}${key}: ${preparedValue}`;
    });
    const outRepeat = replacer.repeat(depth);
    const rawResult = ['{', ...line, `${outRepeat}}`].join('\n');
    return rawResult;
  };
  const lines = [];
  const indentation = replacer.repeat(spacesCount);
  diffTree.forEach(({ key, value, status }) => {
    switch (status) {
      case 'nested':
        lines.push(`${indentation}${key}: ${stylish(value, replacer, spacesCount + 1)}`);
        break;
      case 'added':
        lines.push(`${indentation.slice(2)}+ ${key}: ${iter(value, spacesCount)}`);
        break;
      case 'deleted':
        lines.push(`${indentation.slice(2)}- ${key}: ${iter(value, spacesCount)}`);
        break;
      case 'changed':
        lines.push(`${indentation.slice(2)}- ${key}: ${iter(value[0], spacesCount)}`);
        lines.push(`${indentation.slice(2)}+ ${key}: ${iter(value[1], spacesCount)}`);
        break;
      case 'unchanged':
        lines.push(`${indentation}${key}: ${iter(value, 1)}`);
        break;
      default:
        throw new Error(`Unknown status: '${status}'!`);
    }
  });
  const outRepeat = replacer.repeat(spacesCount - 1);
  return ['{', ...lines, `${outRepeat}}`].join('\n');
};

export default stylish;
