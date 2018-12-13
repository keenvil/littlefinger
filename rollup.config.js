import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/littlefinger.js',
    format: 'es'
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['@babel/env', { modules: false }]],
      plugins: ['@babel/external-helpers', '@babel/plugin-proposal-class-properties'],
      externalHelpers: true
    })
  ],
  external: ['lodash']
}
