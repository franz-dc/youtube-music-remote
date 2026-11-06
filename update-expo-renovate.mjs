/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '.');

const expoPackagePath = path.join(root, 'node_modules/expo/package.json');
const bundledModulesPath = path.join(
  root,
  'node_modules/expo/bundledNativeModules.json'
);
const renovatePath = path.join(root, 'renovate.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const expoPackage = readJson(expoPackagePath);
const bundledNativeModules = readJson(bundledModulesPath);
const renovate = readJson(renovatePath);

const expoVersion = expoPackage.version;

if (!expoVersion) {
  throw new Error(`Could not determine Expo version from ${expoPackagePath}`);
}

const groupName = `expo-${expoVersion
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-|-$/g, '')}`;

const expoPackageRules = Object.entries(bundledNativeModules).map(
  ([packageName, version]) => ({
    matchPackageNames: [packageName],
    allowedVersions: version,
    groupName,
  })
);

// Keep all non-Expo grouped rules and remove the old Expo rules.
renovate.packageRules = [
  ...(renovate.packageRules ?? []).filter(
    (rule) =>
      typeof rule.groupName !== 'string' || !rule.groupName.startsWith('expo-')
  ),
  ...expoPackageRules,
];

fs.writeFileSync(renovatePath, `${JSON.stringify(renovate, null, 2)}\n`);

console.log(
  `Updated ${expoPackageRules.length} Expo package rules for ${groupName}`
);
