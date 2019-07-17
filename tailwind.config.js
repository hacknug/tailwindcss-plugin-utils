const plugin = require('~/src/plugin.js')
const pluginOptions = {}

module.exports = {
  theme: {
    extend: {},
    screens: { sm: '640px' },

    textColor: {}, // Forces using `bgColor` as fallback
    backgroundColor: { tailwind: '#38b2ac' },

    columnSpan: ['none', 'all'],
    columnCount: [2, 4], // Forces building object from array
    columnGap: {}, // Forces using `gap` as fallback

    gap: {
      4: '1rem',
      8: '2rem',
    },
  },

  plugins: [plugin(pluginOptions)],
}
