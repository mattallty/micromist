const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
const minimist = require('minimist');
const micromist = require('../src/micromist');
const Table = require('cli-table2');

const argv = [
  "node", "micromist.js",
  "jkazd", "-e", "-2", "--foo=bar", "fooo", "baaar", "-ozdl", "done", "--no-food=false", "-f", "foo", "-f", "max",
  "-g", "3", "-x", "3e10", "--", "-f=ppp", "-f", "kef", "-ab"];

// add tests
suite
  .add('minimist(process.argv)', function() {
    minimist(argv.slice(2));
  })
  .add('micromist(process.argv)', function() {
    micromist(argv);
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));

    const tbl = new Table({
      head: ['Name', 'Mean time', 'Ops/sec', 'Diff']
    });

    let prev, diff;

    suite.forEach(el => {
      if (prev) {
        diff = ((el.hz - prev) * 100 / prev).toFixed(2) + '% faster';
      } else {
        diff = 'N/A'
      }
      prev = el.hz;
      tbl.push([el.name, el.stats.mean, el.hz, diff])
    });
    console.log(tbl.toString());
  })
  // run async
  .run(/*{ 'async': true }*/);