'use strict';

const
   program = require('commander'),
   consts = require('./consts'),
   fs = require('fs'),
   path = require('path'),
   Log = require('./log');

function collect(value, previous) {
   return previous.concat([value]);
}

async function processFile(filename, options, report) {
   console.log(`====| Processing file ${filename}`);
   const func = options['func'] && require('./funcs/' + options['func']);
   const log = new Log(filename, options, report, func);
   await log.process();
}

program
   .command('<log-path>', 'Path to log file')
   .option('-v, --verbose', 'Print detailed debug information')
   .option('--print', 'Print parsed events')
   .option('--func <functionName>', 'Print parsed events')
   .option('--filter <CSV>', 'Process only these events, CSV', v => v.split(","), undefined)
   .option('--ignore-ver-err', 'Ignore combat log version errors')
   .option('--sum <field>', 'Aggregate one of: ' + Object.values(consts.fields).join(', '), collect, [])
   .option('--ext <extension>', 'Process only files with this extension')
   .action(async (logPath, options) => {
      const report = {};
      if (fs.lstatSync(logPath).isDirectory()) {
         const files = fs.readdirSync(logPath);
         for (let file of files) {
            if (options['ext'] && !file.endsWith('.' + options['ext']))
               continue;
            await processFile(path.join(logPath, file), options, report);
         }
      } else
         await processFile(logPath, options, report);
   });

program.parse(process.argv);
