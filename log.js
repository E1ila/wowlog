const readline = require('readline');
const fs = require('fs');
const parser = require('./parser');
const consts = require('./consts');

module.exports = class Log {

   constructor(filename, options) {
      this.filename = filename;
      this.options = options;
      this.initResult();
   }

   process() {
      return new Promise((resolve) => {
         let versionData = {version: 0, advanced: 0, build: null, projectId: 0};
         let lineNumber = 0;

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
                  console.error(line);
                  console.error(`Failed parsing line #${lineNumber}: ${e.stack}`);
               }
               if (event) {
                  try {
                     this.processEvent(lineNumber, event);
                  } catch (e) {
                     console.error(`#${lineNumber} EVENT ` + JSON.stringify(event));
                     console.error(`Failed processing event #${lineNumber}: ${e.stack}`);
                  }
               }
            }
         });

         readInterface.on('close', line => {
            resolve();
         });
      });
   }

   processEvent(lineNumber, event) {
      if (this.options['printEvents'])
         console.log(`#${lineNumber} EVENT ` + JSON.stringify(event));

      // for (let field of this.options['sum']) {
      //    if (field === consts.fields.damage) {
      //    }
      // }
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
}