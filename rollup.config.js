import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH;

export default {
  input: 'src/air-quality-monitor-card.ts',
  output: {
    file: 'dist/air-quality-monitor-card.js',
    format: 'es',
    inlineDynamicImports: true,
    sourcemap: dev ? 'inline' : false,
  },
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    typescript({
      declaration: false,
      sourceMap: dev,
    }),
    json(),
    !dev && terser({
      ecma: 2022,
      module: true,
      output: {
        comments: false,
      },
    }),
  ],
};
