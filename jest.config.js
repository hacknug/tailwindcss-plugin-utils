const resolveConfig = require('tailwindcss/resolveConfig')
const tailwindConfig = require('./tailwind.config.js')

const config = resolveConfig(tailwindConfig)

module.exports = {
  globals: {
    /** // TODO look into using core methods directly
     * Plugin functions receive a single object argument that can be destructured
     * into several helper functions: https://tailwindcss.com/docs/plugins
     */
    addUtilities: () => {},
    addComponents: () => {},
    addBase: () => {},
    addVariant: () => {},
    e: () => {},
    prefix: () => {},
    theme: (themeKey, fallbackValue) => config.theme[themeKey] || fallbackValue,
    variants: () => {},
    config,

    /**
     * These utils still depend on some things
     */
    defaultValues: {
      columnSpan: ['none', 'all'],
      columnGap: { 4: '1rem', 8: '2rem' },
    },
  },
}
