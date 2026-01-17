#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const child = require('child_process');

const scriptDir = __dirname;
const rootDir = path.resolve(scriptDir, '..');
const defaultCli = path.join(rootDir, '..', 'oxc', 'apps', 'oxlint', 'dist', 'cli.js');
const cli = process.argv[2] || defaultCli;

if (!fs.existsSync(cli)) {
  console.error(`Warning: CLI not found at ${cli}`);
  console.error('You can pass an alternate CLI path as the first argument.');
}

const configsDir = path.join(rootDir, 'configs');
if (!fs.existsSync(configsDir)) {
  console.error(`Configs directory not found: ${configsDir}`);
  process.exit(1);
}

const configs = fs.readdirSync(configsDir).filter((f) => f.endsWith('.json'));
if (configs.length === 0) {
  console.log('No config files found in', configsDir);
  process.exit(0);
}

for (const file of configs) {
  const cfgPath = path.join(configsDir, file);
  console.log('\n============================================================');
  console.log(`Config: ${cfgPath}`);
  console.log(`Command: node ${cli} -c=${cfgPath}`);
  console.log('------------------------------------------------------------');

  if (!fs.existsSync(cli)) {
    console.error(`Skipping: CLI not found at ${cli}`);
    continue;
  }

  const res = child.spawnSync('node', [cli, `-c=${cfgPath}`], { encoding: 'utf8' });

  if (res.stdout) {
    for (const line of res.stdout.split(/\r?\n/)) {
      if (line.length) console.log('   ' + line);
    }
  }

  if (res.stderr) {
    for (const line of res.stderr.split(/\r?\n/)) {
      if (line.length) console.error('   ' + line);
    }
  }

  console.log('------------------------------------------------------------');
  console.log(`Exit code: ${res.status}`);
}

console.log('\nDone.');
