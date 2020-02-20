const readline = require('readline');
const fs = require('fs');
const parser = require('./parser');
const consts = require('./consts');

module.exports = class Log {

   constructor(filename, options, report, customFunc) {
      this.filename = filename;
      this.options = options;
      this.customFunc = customFunc;
      this.report = report;
      this.initResult();
   }

   process() {
      return new Promise((resolve, reject) => {
         let versionData = {version: 0, advanced: 0, build: null, projectId: 0};
         let lineNumber = 0;
         let lastEvent;

         const readInterface = readline.createInterface({
            input: fs.createReadStream(this.filename),
            output: process.stdout,
            console: false
         });

         readInterface.on('line', line => {
            lineNumber++;
            if (line.indexOf('COMBAT_LOG_VERSION') !== -1) {
               const data = line.split('  ')[1].split(',');
               versionData = {
                  version: parseFloat(data[1]),
                  advanced: data[3] == '1',
                  build: data[5],
                  projectId: parseFloat(data[7]),
               }
            } else {
               let event;
               try {
                  event = parser.line(line, versionData.version);
               } catch (e) {
                  if (e.message.indexOf('Unsupported version:') !== -1) {
                     if (!this.options['ignoreVerErr'])
                        console.error(e.message);
                     return reject('Unsupported combat log version');
                  } else {
                     console.error(line);
                     console.error(`Failed parsing line #${lineNumber}: ${e.stack}`);
                  }
               }
               if (event) {
                  try {
                     this.processEvent(lineNumber, event, lastEvent);
                  } catch (e) {
                     console.error(`#${lineNumber} EVENT ` + JSON.stringify(event));
                     console.error(`Failed processing event #${lineNumber}: ${e.stack}`);
                  }
               }
               lastEvent = event;
            }
         });

         readInterface.on('close', line => {
            this.finish();
            resolve();
         });
      });
   }

   processEvent(lineNumber, event, lastEvent) {
      if (event.event === 'ENCOUNTER_START')
         this.report.encounters[event.encounterName] = (this.report.encounters[event.encounterName] || 0) + 1;

      if (this.options['filter']) {
         if (this.options['filter'].indexOf(event.event) === -1)
            return;
      }
      if (this.options['print'])
         console.log(`#${lineNumber} EVENT ` + JSON.stringify(event));

      if (this.customFunc)
         this.customFunc.processEvent(this, this.options, lineNumber, event, lastEvent);
   }

   initResult() {
      this.result = {};
      if (this.options['sum'].length) {
         this.result.sum = {};
         for (let field of this.options['sum']) {
            this.result.sum[field] = 0;
         }
      }
   }

   ensureEntry(obj, name, defaultValue) {
      if (obj[name] === undefined)
         obj[name] = defaultValue;
   }

   finish() {
      if (this.customFunc)
         this.customFunc.finishFile(this, this.options);
   }
}
