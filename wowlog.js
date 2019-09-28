'use strict';

const program = require('commander');
const consts = require('./consts');
const Log = require('./log');

function collect(value, previous) {
   return previous.concat([value]);
}

program
   .command('<log-path>', 'Path to log file')
   .option('-v, --verbose', 'Print detailed debug information')
   .option('--printEvents', 'Print parsed events')
   .option('--sum <field>', 'Aggregate one of: ' + Object.values(consts.fields).join(', '), collect, [])
   .action(async (logPath, options) => {
      const log = new Log(logPath, options);
      await log.process();
   });

program.parse(process.argv);