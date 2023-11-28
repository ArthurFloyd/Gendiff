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

const stylish = (value, replacer = '  ', spacesCount = 2) => {
  const iter = (data, depth) => {
    if (!_.isObject(data)) {
      return `${data}`;
    }

    const repeat = replacer.repeat(depth);
    const line = Object.entries(data).map(([key, val]) => {
      const preparedValue = iter(val, depth + spacesCount);
      if (!key.startsWith('- ') && !key.startsWith('+ ')) {
        return `${`${repeat}${replacer}`}${key}: ${preparedValue}`;
      }

      return `${repeat}${key}: ${preparedValue}`;
    });
    const outRepeat = Object.keys(data).find((keey) => !keey.startsWith('- ') || !keey.startsWith('+ ')) && depth >= spacesCount ? replacer.repeat(depth - spacesCount + 1) : replacer.repeat(depth);
    const rawResult = ['{', ...line, `${outRepeat}}`].join('\n');

    return rawResult;
  };

  let resultFinal = iter(value, 1);
  resultFinal = `${resultFinal.slice(0, resultFinal.length - 3)}}`;

  return resultFinal;
};

const genStatuses = (object1, object2) => {
  // console.log(0, object2);
  const keys = _.union(_.keys(object1), _.keys(object2));
  const sortKeys = keys.sort();
  const result = [];
  // let logs = '';
  // const complexValue = '[complex value]';
  sortKeys.forEach((key) => {
    // FOR OBJECTS
    const keyName = key;
    if (_.isObject(object1[key]) || _.isObject(object2[key])) {
      if (_.isObject(object1[key]) && _.isObject(object2[key])) {
        result.push({ key, children: genStatuses(object1[key], object2[key]) });
        // result[`${key}`] = genDiff(object1[key], object2[key]); // stylish
        // logs += genDiff(object1[key], object2[key], formatter, keyName);
      } else if (!object1[key]) {
        result.push({ key, value: object2[key], status: 'added' });
        // result[`+ ${key}`] = object2[key]; // stylish
        // logs += `Property '${keyName}' was added with value: ${complexValue}\n`;
      } else if (!object2[key]) {
        result.push({ key, value: object1[key], status: 'deleted' });
        // result[`- ${key}`] = object1[key]; // stylish
        // logs += `Property '${keyName}' was removed\n`;
      } else {
        result.push({ key, value: [object1[key], object2[key]], status: 'changed' });
        // result[`- ${key}`] = object1[key]; // sylish
        // result[`+ ${key}`] = object2[key];
        // const object1Value = typeof object1[key] === 'object' ? complexValue : object1[key];
        // const object2Value = typeof object2[key] === 'object' ? complexValue : object2[key];
        // logs += `Property '${keyName}' was updated. From ${object1Value} to ${object2Value}\n`;
      }
    // FOR PLAIN DATA TYPES
    } else if (!Object.hasOwn(object1, key)) {
      result.push({ key, value: object2[key], status: 'added' });
      // result[`+ ${key}`] = object2[key]; // stylish
      // logs += `Property '${keyName}' was added with value: ${object2[key]}\n`;
    } else if (!Object.hasOwn(object2, key)) {
      result.push({ key, value: object1[key], status: 'deleted' });
      // result[`- ${key}`] = object1[key]; // stylish
      // logs += `Property '${keyName}' was removed\n`;
    } else if (object1[key] !== object2[key]) {
      result.push({ key, value: [object1[key], object2[key]], status: 'changed' });
      // result[`- ${key}`] = object1[key]; // stylish
      // result[`+ ${key}`] = object2[key];
      // logs += `Property '${keyName}' was updated. From ${object1[key]} to ${object2[key]}\n`;
    } else {
      result.push({ key, value: object1[key], status: 'unchanged' });
      // result[`${key}`] = object1[key]; // stylish
    }
  });

  return result;
};

const plainify = (statuses, fieldName = '') => {
  let logs = '';
  const complexValue = '[complex value]';
  statuses.forEach(({
    key, children, value, status,
  }) => {
    const keyName = fieldName || key;
    if (children) {
      logs += plainify(children, key); // TODO finish
    } else if (status === 'added') {
      logs += `Property '${keyName}' was added with value: ${value}\n`;
    } else if (status === 'deleted') {
      logs += `Property '${keyName}' was removed\n`;
    } else if (status === 'changed') {
      logs += `Property '${keyName}' was updated. From ${value[0]} to ${value[1]}\n`;
    }
  });

  return logs;
};

const genDiff = (object1, object2, formatter = 'plain') => {
  const statuses = genStatuses(object1, object2);
  switch (formatter) {
    case 'plain':
      return plainify(statuses);
    default:
      return statuses;
  }
};

const result = genDiff(json1, json2);
console.log(result);

export { genDiff, stylish };
