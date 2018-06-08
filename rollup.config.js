const babel = require('rollup-plugin-babel');

export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/index.min.js',
    format: 'umd',
    name: 'googleTasksApi'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
  ]
}; 
