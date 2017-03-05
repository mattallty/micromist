#!/usr/bin/env node
const micromist = require('../');
const minimist = require('minimist');

const args = micromist(process.argv);

console.log("micromist");
console.log(args);


const args2 = minimist(process.argv.slice(2));

console.log("minimist");
console.log(args2);