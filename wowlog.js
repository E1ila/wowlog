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

let buffs = {};
let debuffLog = {};
const ALLOWED_DEATH_SPELLS = ['Drain Soul', 'Shadowburn', 'Lesser Invisibility'];
const MAX_DEBUFF_SLOTS = 16;

/**
 * Finds diff between two arrays
 * @param arr1
 * @param arr2
 * @returns {added: any[], removed: any[]}
 */
function findDiff(arr1, arr2) {
   let _arr2 = [].concat(arr2);
   const removed = [];
   for (let item of arr1) {
      let pos2 = _arr2.indexOf(item);
      if (pos2 !== -1)
         _arr2.splice(pos2, 1);
      else
         removed.push(item);
   }
   return {added: _arr2, removed}
}

function formatDiff(diff) {
   if (!diff)
      return ``;
   return `added:${JSON.stringify(diff.added)} removed:${JSON.stringify(diff.removed)} pushed:${JSON.stringify(diff.pushed || [])}`
}

function formatPushed(diff) {
   if (!diff)
      return ``;
   let st = `${diff.added[0]} --->| ${diff.pushed[0]}`
   if (diff.removed.length)
      st += ` !! diff has removed buffs ${JSON.stringify(diff.removed)}`;
   if (diff.added.length > 1)
      st += ` !! diff has more than one added buffs ${JSON.stringify(diff.added)}`;
   if (diff.pushed.length > 1)
      st += ` !! diff has more than one pushed buffs ${JSON.stringify(diff.pushed)}`;
   return st;
}

function pushedBuffs(options, lineNumber, event) {
   const mobGuid = event.target.guid;
   if (!mobGuid.startsWith('Creature'))
      return;
   if (!buffs[mobGuid]) {
      buffs[mobGuid] = [];
      debuffLog[mobGuid] = [];
   }
   const mobBuffs = buffs[mobGuid];
   if (event.event === 'UNIT_DIED') {
      const pushedBuffs = debuffLog[mobGuid].filter(row => row.length > 2 && row[row.length - 1] && row[row.length - 1].pushed);
      if (pushedBuffs.length) {
         if (options['verbose']) {
            let maxSlotBuffs = debuffLog[mobGuid].filter(row => row.length - 2 >= MAX_DEBUFF_SLOTS - 1); // it includes timestamp and diff, so +2
            if (maxSlotBuffs.length) {
               const timestamps = maxSlotBuffs.map(row => row[0]);
               const changesWithinMaxSlotsTimestamps = debuffLog[mobGuid].filter(row => timestamps.indexOf(row[0]) !== -1);
               if (changesWithinMaxSlotsTimestamps.length > 1) {
                  console.log(`${mobGuid} ${event.target.name}\n${changesWithinMaxSlotsTimestamps.map(row => `${row[0]}  ${row.length - 2}  ${formatDiff(row[row.length - 1])}`).join("\n")}`);
                  console.log('--------------------------------');
               }
            }
         } else
            console.log(`------ ${mobGuid} ${event.target.name}\n${pushedBuffs.map(row => `${row[0]}  ${row.length - 2}  ${formatPushed(row[row.length - 1])}`).join("\n")}`);
      }
      if (mobBuffs) {
         delete buffs[mobGuid];
         delete debuffLog[mobGuid];
      }
      // for (let buffName of Object.keys(mobBuffs)) {
      //    if (mobBuffs[buffName] && ALLOWED_DEATH_SPELLS.indexOf(buffName) === -1)
      //       console.log('mob died with buffs');
      // }
   } else {
      const applied = event.event === 'SPELL_AURA_APPLIED';
      if (event.auraType !== "DEBUFF")
         return;
      if (applied)
         mobBuffs.push(event.spell.name);
      else {
         const index = mobBuffs.indexOf(event.spell.name);
         if (index === -1)
            console.error(`Couldn't find buff ${event.spell.name} in mob's ${event.target.name} debuffs`);
         else
            mobBuffs.splice(index, 1);
      }
      const mobDeuffLog = debuffLog[mobGuid];
      let currBuffs = [''+(+event.date)].concat(mobBuffs);
      if (mobDeuffLog.length && mobDeuffLog[mobDeuffLog.length - 1].length > 1) {
         const prevBuffs = mobDeuffLog[mobDeuffLog.length - 1];
         const arr1 = prevBuffs.slice(1, prevBuffs.length - 1);
         const diff = findDiff(arr1, mobBuffs)
         // curr 16 slots and same ts as prev
         if (mobBuffs.length === MAX_DEBUFF_SLOTS && currBuffs[0] === prevBuffs[0] && prevBuffs[prevBuffs.length - 1].removed.length)
            diff.pushed = prevBuffs[prevBuffs.length - 1].removed;
         currBuffs.push(diff);
      } else
         currBuffs.push(null);
      mobDeuffLog.push(currBuffs);
   }
}

async function processFile(filename, options) {
   const log = new Log(filename, options, options['func'] && eval(options['func']));
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
   .action(async (logPath, options) => {
      if (fs.lstatSync(logPath).isDirectory()) {
         const files = fs.readdirSync(logPath);
         for (let file of files)
            await processFile(path.join(logPath, file), options);
      } else
         await processFile(logPath, options);
   });

program.parse(process.argv);
