import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

await build({
  entryPoints: [resolve(projectRoot, 'app.js')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  outfile: resolve(projectRoot, 'dist/app.js'),
});