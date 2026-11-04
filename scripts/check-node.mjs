import { readFileSync } from 'node:fs';

const {
  engines: { node: expectedNodeVersion },
} = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const currentNodeVersion = process.versions.node;

if (currentNodeVersion !== expectedNodeVersion) {
  console.error(`Node.js 版本必须是 ${expectedNodeVersion}，当前版本是 ${currentNodeVersion}`);
  process.exit(1);
}
