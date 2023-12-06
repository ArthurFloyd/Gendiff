import yaml from 'js-yaml';

const getParseFile = (format, data) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.load(data);
    case 'yaml':
      return yaml.load(data);
    default:
      throw new Error(`Unknown format: '${format}'!`);
  }
};

export default getParseFile;
