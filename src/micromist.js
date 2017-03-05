"use strict";

function isOption(str) {
  return (str || '').match(/^--?[^\d]+/);
}

function isMulti(str) {
  if (str.match(/^-([a-z]{2,})/i)) {
    return str.substr(1).split('');
  }
}

function compute(r, name, val) {
  const origName = name;
  name = name.replace(/^--?/, '');
  if (name.substr(0, 3) === 'no-') {
    name = name.substr(3);
    val = false;
  }
  const mul = isMulti(origName);
  if (mul) {
    mul.forEach(o => r[o] = true);
    return r;
  }
  r[name] = name in r ? [r[name]].concat(val) : val;
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