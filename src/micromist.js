"use strict";

const camelCase = require('lodash.camelcase');

function micromist(args) {

  args = args.slice(2);

  const r = {_:[]};
  const it = args[Symbol.iterator]();
  let curr;

  function isOption(str) {
    return str.match(/^--?[^\d]+/);
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

  while((curr = it.next()) && !curr.done) {

    const val = curr.value;

    if (!isOption(val)) {
      r._.push(val);
      continue;
    } else if (val === '--') {
      r._ = r._.concat(args.slice(args.indexOf('--')));
      break;
    }

    const parts = val.split('=');

    if (parts.length > 1) {
      compute(r, parts[0], parts[1]);
    } else {
      const next = it.next();
      compute(r, parts[0], isOption(next.done ? '' : next.value) ? true : next.value);
    }
  }

  return r;
}

module.exports = micromist;