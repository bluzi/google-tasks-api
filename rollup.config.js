const uglify = require('rollup-plugin-uglify').uglify;
const minify = require('uglify-es').minify;

export default {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'googleTasksApi'
    },
    plugins: [ uglify({}, minify) ]
  };