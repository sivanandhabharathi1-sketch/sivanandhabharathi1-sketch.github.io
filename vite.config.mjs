import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({build:{rollupOptions:{input:{home:resolve('index.html'),work:resolve('work/index.html'),about:resolve('about/index.html'),contact:resolve('contact/index.html')}}}});
