'use strict';
/*
 *    wow-log-parser - Parse World of Warcraft combat logs
 *   Copyright (C) 2017   Jan Koppe <post@jankoppe.de>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// starts at 1
module.exports.schools = ['Physical', 'Holy', 'Holystrike', 'Fire',
                'Flamestrike', 'Holyfire', '', 'Nature',
                'Stormstrike', 'Holystorm', '', 'Firestorm',
                '', '', '', 'Frost',
                'Froststrike', 'Holyfrost', '', 'Frostfire',
                '', '', '', 'Froststorm',
                '', '', '', 'Elemental',
                '', '', '', 'Shadow',
                'Shadowstrike', 'Twilight', '', 'Shadowflame',
                '', '', '', 'Plague',
                '', '', '', '',
                '', '', '', 'Shadowfrost',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', 'Arcane',
                'Spellstrike', 'Divine', '', 'Spellfire',
                '', '', '', 'Astral',
                '', '', '', '',
                '', '', '', 'Spellfrost',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', 'Spellshadow',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', '',
                '', '', '', 'Chromatic (Chaos)',
                '', 'Magic', 'Chaos'
              ]

// starts at -2
// module.exports.powers = ['Health', '', 'Mana', 'Rage', 'Focus', 'Energy', '', 'Runes', 'Runic Power'];
module.exports.powers = ['Health', '', 'Mana', 'Rage', 'Focus', 'Energy', 'Happiness', 'Runes', 'Runic Power', 'Soul Shards', 'Eclipse', 'Holy Power'];

// https://wow.gamepedia.com/DifficultyID
module.exports.difficultyIDs = {
   "1": "Normal",
   "2": "Heroic",
   "3": "10 Player",
   "4": "25 Player",
   "5": "10 Player (Heroic)",
   "6": "25 Player (Heroic)",
   "7": "Looking For Raid",
   "8": "Mythic Keystone",
   "9": "40 Player",
   "11": "Heroic Scenario",
   "12": "Normal Scenario",
   "14": "Normal raid",
   "15": "Heroic",
   "16": "Mythic",
   "17": "Looking For Raid",
   "18": "Event",
   "19": "Event",
   "20": "Event Scenario",
   "23": "Mythic",
   "24": "Timewalking",
   "25": "World PvP Scenario",
   "29": "PvEvP Scenario",
   "30": "Event",
   "32": "World PvP Scenario",
   "33": "Timewalking",
   "34": "PvP",
   "38": "Normal",
   "39": "Heroic",
   "40": "Mythic",
   "45": "PvP",
   "147": "Normal	scenario	(Warfronts)",
   "149": "Heroic	scenario",
   "151": "Looking For Raid",
   "152": "Visions of N'Zoth",
   "153": "Teeming Island"
}
