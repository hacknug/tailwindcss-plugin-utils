const plugin = require('./src/plugin.js')
const pluginOptions = {}

module.exports = {
  theme: {
    textColor: {}, // Forces using `bgColor` as fallback
    backgroundColor: { tailwind: '#38b2ac' },

    borderColor: { red: 'red' },
    borderWidth: { 2: '2px' },

    columnSpan: ['none', 'all'],
    columnCount: [2, 4], // Forces building object from array
    // columnGap: {}, // Forces using `gap` as fallback

    gap: {
      4: '1rem',
      8: '2rem',
      '1/2': '50%',
    },
  },

  plugins: [plugin(pluginOptions)],
}
