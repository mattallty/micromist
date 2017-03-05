"use strict";

const camelCase = require('lodash.camelcase');

function isOption(str) {
  return (str || '').match(/^--?[^\d]+/);
}

function isMulti(str) {
  if (str.match(/^-([a-z]{2,})/i)) {
    return str.substr(1).split('');
  }
}

function compute(r, name, val) {
  let nameCam = camelCase(name.replace(/^--?/, ''));
  if (name.substr(0, 5) === '--no-') {
    nameCam = camelCase(nameCam.substr(2));
    val = false;
  }
  const mul = isMulti(name);
  if (mul) {
    mul.forEach(o => r[o] = true);
    return r;
  }
  r[nameCam] = nameCam in r ? [r[nameCam]].concat(val) : val;
  return r;
}

function micromist(args) {

  args = args.slice(2);

  const r = {_:[]};
  let pointer = 0;

  while(typeof args[pointer] !== 'undefined') {

    const val = args[pointer];

    if (!isOption(val)) {
      r._.push(val);
      pointer++;
      continue;
    } else if (val === '--') {
      r._ = r._.concat(args.slice(args.indexOf('--')));
      break;
    }

    const parts = val.split('=');
    let isNextOpt = true;

    if (parts.length > 1) {
      compute(r, parts[0], parts[1]);
    } else {
      const next = args[pointer+1];
      isNextOpt = isOption(next);
      compute(r, parts[0], isNextOpt ? true : next || true);
    }

    pointer += isNextOpt ? 1 : 2;
  }

  return r;
}

module.exports = micromist;