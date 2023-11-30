#!/usr/bin/env node
import { program } from 'commander';
import genearateDiff from '../src/formatters/index.js';
import { findFile } from '../src/index.js';
import getParsePathFile from '../src/parsers.js';

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2) => {
    const absolutePath1 = findFile(filepath1, '__fixtures__');
    const absolutePath2 = findFile(filepath2, '__fixtures__');
    console.log(absolutePath1);
    const file1 = getParsePathFile(absolutePath1);
    const file2 = getParsePathFile(absolutePath2);
    console.log(genearateDiff(file1, file2, program.opts().format));
  });

program.parse();
