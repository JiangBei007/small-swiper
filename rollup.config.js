/*
gaojingwei 2019
*/
import json from 'rollup-plugin-json'
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
	name:'SolarSwiper',
    format: 'umd'
  },
  plugins: [ json() ]
};