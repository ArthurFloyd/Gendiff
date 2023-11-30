import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const getParsePathFile = (absolutePath) => {
  const format = path.extname(absolutePath);
  const data = fs.readFileSync(absolutePath);

  switch (format) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
      return yaml.load(data);
    case '.yaml':
      return yaml.load(data);
    default:
      throw new Error(`Unknown format: '${format}'!`);
  }
};

export default getParsePathFile;
