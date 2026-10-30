import {build} from 'vite';
import {cp,mkdir,writeFile} from 'node:fs/promises';
await build();
await mkdir('docs',{recursive:true});
await cp('dist','docs',{recursive:true});
await writeFile('docs/.nojekyll','');
console.log('GitHub Pages output is ready in docs/.');
