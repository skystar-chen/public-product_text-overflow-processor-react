import { readFileSync, writeFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

const publishPackage = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  repository: packageJson.repository,
  homepage: packageJson.homepage,
  bugs: packageJson.bugs,
  main: packageJson.main,
  typings: packageJson.typings,
  types: packageJson.types,
  exports: packageJson.exports,
  files: packageJson.files,
};

for (const [key, value] of Object.entries(publishPackage)) {
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
    delete publishPackage[key];
  }
}

writeFileSync('package.json', `${JSON.stringify(publishPackage, null, 2)}\n`);
