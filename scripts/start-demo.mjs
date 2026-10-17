import {cpSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {config as loadEnvironment} from 'dotenv';

const root = process.cwd();
loadEnvironment({path: resolve(root, '.env.local'), quiet: true});
loadEnvironment({path: resolve(root, '.env'), quiet: true});
const distDir=process.env.VSCHOOL_E2E==='1'?'.next-e2e':'.next';
if(process.env.VSCHOOL_DOCUMENTS_MODE==='synthetic'){
  process.env.VSCHOOL_DOCUMENTS_STORAGE_ROOT ??= resolve(root,'artifacts/documents-private');
  const localClam='/opt/homebrew/bin/clamscan',localDefinitions=resolve(root,'artifacts/documents-clamav/signatures');
  if(existsSync(localClam))process.env.VSCHOOL_CLAMAV_EXECUTABLE ??= localClam;
  if(existsSync(resolve(localDefinitions,'daily.cvd')))process.env.VSCHOOL_CLAMAV_DATABASE_DIRECTORY ??= localDefinitions;
}
const standalone = resolve(root, `${distDir}/standalone`);
const serverRoot=existsSync(resolve(standalone,'server.js'))?standalone:resolve(root,distDir);
if (!existsSync(resolve(serverRoot, 'server.js'))) throw new Error(`No ${distDir} server build found. Run pnpm build before pnpm demo:start.`);

if(serverRoot===standalone)cpSync(resolve(root, `${distDir}/static`), resolve(standalone, `${distDir}/static`), {recursive: true});
if (existsSync(resolve(root, 'public'))) {
  cpSync(resolve(root, 'public'), resolve(serverRoot, 'public'), {recursive: true});
}

process.env.HOSTNAME ??= '127.0.0.1';
process.env.PORT ??= '3400';
await import(resolve(serverRoot,'server.js'));
