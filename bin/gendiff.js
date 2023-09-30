#!/usr/bin/env node
import { program } from 'commander';
import { genDiff, findFileAndConvertToJson } from '../index.js';

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2) => {
    const json1 = findFileAndConvertToJson(filepath1, '__fixtures__');
    const json2 = findFileAndConvertToJson(filepath2, '__fixtures__');
    const result = genDiff(json1, json2);

    console.log(result);
  });

program.parse();
