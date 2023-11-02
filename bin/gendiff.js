#!/usr/bin/env node
import { program } from 'commander';
import { findFile } from '../index.js';
import getParse from '../parsers.js';
import { genDiff, stylish } from '../testaaaa.js';

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2) => {
    const absolutePath1 = findFile(filepath1, '__fixtures__');
    const absolutePath2 = findFile(filepath2, '__fixtures__');
    const file1 = getParse(absolutePath1);
    const file2 = getParse(absolutePath2);
    const result = stylish(genDiff(file1, file2));

    console.log(result);
  });

program.parse();
