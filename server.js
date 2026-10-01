import express from 'express';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build } from 'esbuild';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const memesDirectory = join(projectRoot, 'memes');

await build({
  entryPoints: [join(projectRoot, 'app.js')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  outfile: join(projectRoot, 'dist/app.js'),
});

const app = express();
app.get('/', (_request, response) => response.sendFile(join(projectRoot, 'index.html')));
app.get('/styles.css', (_request, response) => response.sendFile(join(projectRoot, 'styles.css')));
app.get('/dist/app.js', (_request, response) => response.sendFile(join(projectRoot, 'dist/app.js')));
app.get('/memes/', async (_request, response, next) => {
  try {
    const files = await readdir(memesDirectory);
    const links = files.filter(file => /\.(mp3|wav|ogg|m4a|aac|webm)$/i.test(file));
    response.type('html').send(links.map(file => `<a href="${encodeURIComponent(file)}">${file.replace(/[&<>"']/g, '')}</a>`).join('\n'));
  } catch (error) {
    next(error);
  }
});
app.use('/memes', express.static(memesDirectory, { dotfiles: 'deny', index: false }));

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`Roblox Lua Builder listening on http://localhost:${port}`));