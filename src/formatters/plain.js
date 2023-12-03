const planValue = (value) => {
  switch (true) {
    case value === null:
      return value;
    case typeof value === 'object':
      return '[complex value]';
    case typeof value === 'string':
      return `'${value}'`;
    default:
      return value;
  }
};

const plain = (diffTree, parentKey = '') => {
  const logs = [];
  diffTree.forEach(({
    key, value, status,
  }) => {
    const keyNameOriginal = `${parentKey}.${key}`;
    const keyName = keyNameOriginal.startsWith('.') ? keyNameOriginal.slice(1) : keyNameOriginal;
    switch (status) {
      case 'nested':
        logs.push(plain(value, keyName));
        break;
      case 'added':
        logs.push(`Property '${keyName}' was added with value: ${planValue(value)}`);
        break;
      case 'deleted':
        logs.push(`Property '${keyName}' was removed`);
        break;
      case 'changed':
        logs.push(`Property '${keyName}' was updated. From ${planValue(value[0])} to ${planValue(value[1])}`);
        break;
      case 'unchanged':
        break;
      default:
        throw new Error(`Unknown status: '${status}'!`);
    }
  });
  return logs.join('\n');
};

export default plain;
