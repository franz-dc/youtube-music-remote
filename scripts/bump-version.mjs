/* eslint-disable no-console */

// Increment "version" field in package.json and app.json
// Sample usage: "yarn update-version (+ params from semver.inc)"

import fs from 'fs';
import path from 'path';
import { inc } from 'semver';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Invalid usage. Refer to semver.inc(...) for parameters');
  process.exit(1);
}

const packageJsonPath = path.join(process.cwd(), 'package.json');
const appJsonPath = path.join(process.cwd(), 'app.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));

const currentVersion = packageJson.version;
const newVersion = inc(currentVersion, ...args);

if (!newVersion) {
  console.error('Invalid version increment type provided.');
  process.exit(1);
}

packageJson.version = newVersion;
appJson.expo.version = newVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

console.log(`Version updated from ${currentVersion} to ${newVersion}`);
process.exit(0);