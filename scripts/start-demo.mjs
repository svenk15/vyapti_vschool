import {cpSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';

const root = process.cwd();
const standalone = resolve(root, '.next/standalone');
if (!existsSync(resolve(standalone, 'server.js'))) {
  throw new Error('No standalone build found. Run pnpm build before pnpm demo:start.');
}

cpSync(resolve(root, '.next/static'), resolve(standalone, '.next/static'), {recursive: true});
if (existsSync(resolve(root, 'public'))) {
  cpSync(resolve(root, 'public'), resolve(standalone, 'public'), {recursive: true});
}

process.env.HOSTNAME ??= '127.0.0.1';
process.env.PORT ??= '3400';
await import('../.next/standalone/server.js');
