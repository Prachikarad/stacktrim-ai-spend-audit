import { access, readFile } from 'node:fs/promises';

const required = ['index.html', 'src/main.js', 'src/audit-engine.js', 'src/pricing-data.js', 'server.mjs'];

for (const file of required) {
  await access(file);
}

const html = await readFile('index.html', 'utf8');
if (!html.includes('src/main.js')) {
  throw new Error('index.html does not load the app entrypoint');
}

console.log('Build check passed.');
