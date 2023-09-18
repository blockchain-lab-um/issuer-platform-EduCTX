import { build } from 'esbuild';

console.log('Building issuer service...');

build({
  entryPoints: ['src/**/*.ts'],
  outdir: 'dist',
  bundle: false,
  treeShaking: true,
  platform: 'node',
  format: 'esm',
  target: 'es2022',
  tsconfig: 'tsconfig.json',
});

console.log('Finished building issuer service...');
