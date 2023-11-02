import _ from 'lodash';

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

const genDiff = (object1, object2) => {
  // console.log(0, object2);
  const keys = _.union(_.keys(object1), _.keys(object2));
  const sortKeys = keys.sort();
  // const result = [];
  const result = {};
  sortKeys.forEach((key) => {
    // FOR OBJECTS
    if (_.isObject(object1[key]) || _.isObject(object2[key])) {
      if (_.isObject(object1[key]) && _.isObject(object2[key])) {
        // result.push({ key, value: [object1[key], object2[key]], status: 'object' });
        result[`${key}`] = genDiff(object1[key], object2[key]);
      } else if (!object1[key]) {
        // result.push({ key, value: object2[key], status: 'added' });
        result[`+ ${key}`] = object2[key];
      } else if (!object2[key]) {
        // result.push({ key, value: object1[key], status: 'deleted' });
        result[`- ${key}`] = object1[key];
      } else {
        // result.push({ key, value: [object1[key], object2[key]], status: 'changes' });
        result[`- ${key}`] = object1[key];
        result[`+ ${key}`] = object2[key];
      }
    // FOR PLAIN DATA TYPES
    } else if (!Object.hasOwn(object1, key)) {
      // result.push({ key, value: object2[key], status: 'added' });
      result[`+ ${key}`] = object2[key];
    } else if (!Object.hasOwn(object2, key)) {
      // result.push({ key, value: object1[key], status: 'deleted' });
      result[`- ${key}`] = object1[key];
    } else if (object1[key] !== object2[key]) {
      // result.push({ key, value: [object1[key], object2[key]], status: 'changed' });
      result[`- ${key}`] = object1[key];
      result[`+ ${key}`] = object2[key];
    } else {
      // result.push({ key, value: object1[key], status: 'unchanged' });
      result[`${key}`] = object1[key];
    }
  });

  return result;
};

export { genDiff, stylish };
