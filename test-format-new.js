import _ from 'lodash';

const json1 = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting6: {
      key: 'value',
      doge: {
        wow: '',
      },
    },
  },
  group1: {
    baz: 'bas',
    foo: 'bar',
    nest: {
      key: 'value',
    },
  },
  group2: {
    abc: 12345,
    deep: {
      id: 45,
    },
  },
};

const json2 = {
  common: {
    follow: false,
    setting1: 'Value 1',
    setting3: null,
    setting4: 'blah blah',
    setting5: {
      key5: 'value5',
    },
    setting6: {
      key: 'value',
      ops: 'vops',
      doge: {
        wow: 'so much',
      },
    },
  },
  group1: {
    foo: 'bar',
    baz: 'bars',
    nest: 'str',
  },
  group3: {
    deep: {
      id: {
        number: 45,
      },
    },
    fee: 100500,
  },
};

const stylish = (tree, replacer = '....', spacesCount = 1) => {
  const iter = (data, depth) => {
    if (!_.isObject(data)) {
      return `${data}`;
    }
    const repeat = replacer.repeat(depth + 2);
    const line = Object.entries(data).map(([key, val]) => {
      const preparedValue = iter(val, depth + spacesCount);
      return `${repeat}${key}: ${preparedValue}`;
    });
    const outRepeat = replacer.repeat(depth + spacesCount);
    const rawResult = ['{', ...line, `${outRepeat}}`].join('\n');

    return rawResult;
  };
  const spaces = 1;
  const tab = '....';
  const lines = [];
  const indentation = replacer.repeat(2).slice(2);
  tree.map(({ key, value, status }) => {
    switch (status) {
      case 'nested':
        lines.push(`${replacer}${key}: ${stylish(value, tab, spaces + 1)}`);
        break;
      case 'added':
        lines.push(`${indentation}+ ${key}: ${iter(value, 0 + spacesCount)}`);
        break;
      case 'deleted':
        lines.push(`${indentation}- ${key}: ${iter(value, 0 + spacesCount)}`);
        break;
      case 'changed':
        lines.push(`${indentation}- ${key}: ${iter(value[0], 0 + spacesCount)}`);
        lines.push(`${indentation}+ ${key}: ${iter(value[1], 0 + spacesCount)}`);
        break;
      case 'unchanged':
        lines.push(`${indentation}  ${key}: ${iter(value, 0 + spacesCount)}`);
        break;
      default:
        break;
    }
  });
  return ['{', ...lines, '}'].join('\n');
};

const makeAstTree = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2));
  const sortKeys = keys.sort();
  const result = [];
  sortKeys.map((key) => {
    if (_.isObject(object1[key]) && _.isObject(object2[key])) {
      result.push({ key, value: makeAstTree(object1[key], object2[key]), status: 'nested' });
    } else if (!Object.hasOwn(object1, key)) {
      result.push({ key, value: object2[key], status: 'added' });
    } else if (!Object.hasOwn(object2, key)) {
      result.push({ key, value: object1[key], status: 'deleted' });
    } else if (object1[key] !== object2[key]) {
      result.push({ key, value: [object1[key], object2[key]], status: 'changed' });
    } else if (object1[key] === object2[key]) {
      result.push({ key, value: object1[key], status: 'unchanged' });
    }
  });
  return result;
};

console.log(stylish(makeAstTree(json1, json2)));

const planifyValue = (value) => {
  switch (true) {
    case value === null:
      return value;
    case typeof value === 'object':
      return '[complex value]';
    case typeof value === 'string':
      return `${value}`;
    default:
      return value;
  }
};

const plainify = (statuses, parentKey = '') => {
  const logs = [];
  statuses.forEach(({
    key, value, status,
  }) => {
    const keyNameOriginal = `${parentKey}.${key}`;
    const keyName = keyNameOriginal.startsWith('.') ? keyNameOriginal.slice(1) : keyNameOriginal;
    switch (status) {
      case 'nested':
        logs.push(plainify(value, keyName));
        break;
      case 'added':
        logs.push(`Property '${keyName}' was added with value: ${planifyValue(value)}`);
        break;
      case 'deleted':
        logs.push(`Property '${keyName}' was removed`);
        break;
      case 'changed':
        logs.push(`Property '${keyName}' was updated. From ${planifyValue(value[0])} to ${planifyValue(value[1])}`);
        break;
      default:
        break;
    }
  });
  return logs.join('\n');
};

const genDiff = (object1, object2, formatter = 'plain') => {
  const statuses = makeAstTree(object1, object2);
  switch (formatter) {
    case 'plain':
      return plainify(statuses);
    case 'stylish':
      return stylish(statuses);
    // case 'json':
    //   return jsonify(statuses);
    default:
      return statuses;
  }
};

export { genDiff, stylish };
