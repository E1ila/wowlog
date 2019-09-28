const colors = require('ansi-256-colors');

module.exports = {
   redDarker: colors.fg.getRgb(1, 0, 0),
   redDark: colors.fg.getRgb(3, 0, 0),
   red: colors.fg.getRgb(5, 0, 0),
   orangeDark: colors.fg.getRgb(2, 1, 0),
   orange: colors.fg.getRgb(4, 3, 1),
   orangeBright: colors.fg.getRgb(5, 4, 0),
   purpleDark: colors.fg.getRgb(1, 0, 1),
   purple: colors.fg.getRgb(2, 0, 2),
   purpleBright: colors.fg.getRgb(4, 0, 4),
   purpleBg: colors.bg.getRgb(4, 0, 4) + colors.fg.standard[0],
   grayDark: colors.fg.getRgb(1, 1, 1),
   gray: colors.fg.getRgb(3, 3, 3),
   important: colors.bg.getRgb(5, 3, 0) + colors.fg.standard[0],
   title: colors.bg.getRgb(0, 2, 5) + colors.fg.standard[0],
   blueDark: colors.fg.getRgb(0, 0, 3),
   blue: colors.fg.getRgb(0, 1, 5),
   blueBright: colors.fg.getRgb(2, 3, 5),
   greenDark: colors.fg.getRgb(0, 3, 0),
   greenDarker: colors.fg.getRgb(0, 1, 0),
   green: colors.fg.getRgb(0, 4, 0),
   greenBright: colors.fg.getRgb(2, 5, 2),
   cyanDark: colors.fg.getRgb(0, 3, 3),
   cyan: colors.fg.getRgb(0, 4, 4),
   cyanBright: colors.fg.getRgb(1, 5, 5),
   off: colors.reset,
};