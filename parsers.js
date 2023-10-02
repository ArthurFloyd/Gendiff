import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

const getParse = (absolutePath) => {
  const format = absolutePath;
  const data = fs.readFileSync(absolutePath);

  let result;
  if (format.endsWith('.json')) {
    result = JSON.parse(data);
  } else if (format.endsWith('.yaml') || format.endsWith('.yml')) {
    result = yaml.load(data);
  }
  return result;
};

export default getParse;
