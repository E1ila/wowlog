'use strict';

const readline = require('readline');
const fs = require('fs');
const parser = require('wow-log-parser');
const program = require('commander');

program
   .command('parse <LOG_PATH>')
   .action(async (logPath, options) => {
      await processFile(logPath);
   });

function processFile(logPath) {
   return new Promise((resolve) => {
      let versionData = {version: 0, advanced: 0, build: null, projectId: 0};

      const readInterface = readline.createInterface({
         input: fs.createReadStream(logPath),
         output: process.stdout,
         console: false
      });

      readInterface.on('line', function(line) {
         if (line.indexOf('COMBAT_LOG_VERSION') !== -1) {
            const data = line.split('  ')[1].split(',');
            versionData = {
               version: parseFloat(data[1]),
               advanced: data[3] == '1',
               build: data[5],
               projectId: parseFloat(data[7]),
            }
         } else {
            const logEvent = parser.line(line, versionData.version);
            console.log(logEvent);
         }
      });

      readInterface.on('close', function(line) {
         resolve();
      });
   });
}

program.parse(process.argv);