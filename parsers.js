import fs from 'fs';
import yaml from 'js-yaml';

const getParse = (absolutePath) => {
  const format = absolutePath;
  const data = fs.readFileSync(absolutePath);

  switch (format.endsWith()) {
    case format.endsWith('.json'):
      return JSON.parse(data);
    case format.endsWith('.yaml') || format.endsWith('.yml'):
      return yaml.load(data);
    default:
      throw new Error(`Unknown format: '${format}'!`);
  }
};

export default getParse;
