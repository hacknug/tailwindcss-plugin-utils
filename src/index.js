import _ from 'lodash'
import flatten from 'flat'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
// import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '~/tailwind.config.js'

// const config = resolveConfig(tailwindConfig)

/**
 * CONSTANTS
 */

export const FLATTEN_CONFIG = { delimiter: '-', maxDepth: 2 }

/**
 * handleName()
 * @param {*} className
 * @param {*} base
 */

export const handleName = (className, base) => {
  const split = className.split(`${base}-`)
  const prefixedName = `${split[0]}${prefixNegativeModifiers(base, split[1])}`

  return prefixedName.split('-default').join('')
}

export const prefixNegativeModifiers = (base, modifier) => {
  return _.startsWith(modifier, '-') ? `-${base}-${modifier.slice(1)}` : `${base}-${modifier}`
}

/**
 * buildConfig()
 * @param {*} defaultValues
 * @param {*} coreUtils
 * @param {*} themeKey
 * @param {...any} fallbackKeys
 */

export const buildConfig = (coreUtils, themeKey, ...fallbackKeys) => {
  const { theme } = coreUtils
  const themeSettings = getSettings(theme, themeKey, fallbackKeys)

  const settings = themeSettings || getSettings(tailwindConfig.theme, themeKey, fallbackKeys)
  const object = Array.isArray(settings) ? _.zipObject(settings, settings) : settings
  const entries = settings && Object.entries(themeSettings ? flatten(object, FLATTEN_CONFIG) : object)
    .map(([modifier, value]) => [modifier, { [themeKey]: value }])

  return settings ? _.fromPairs(entries) : false
}

export const getSettings = (theme, themeKey, fallbackKeys = []) => {
  const [newThemeKey, ...newFallbackKeys] = fallbackKeys
  const value = typeof theme === 'function' ? theme(themeKey, false) : theme[themeKey]

  return (
    (!_.isEmpty(value) && value) ||
    (fallbackKeys.length && getSettings(theme, newThemeKey, newFallbackKeys))
  )
}

/**
 *
 * @param {*} pluginUtilities
 * @param {*} coreUtils
 */

export const something = (pluginUtilities, coreUtils) => {
  const { addUtilities, e, variants } = coreUtils

  return Object.entries(pluginUtilities)
    .filter(([modifier, values]) => !_.isEmpty(values))
    .forEach(([modifier, values]) => {
      const base = _.kebabCase(modifier).split('-').slice(0, 2).join('-')
      const variantName = Object.keys(Object.entries(values)[0][1])[0]

      // TODO: Fix escaping things separately.
      // Numbers dont't need escaping if they're not the first character.
      const escapedValues = _.fromPairs(Object.entries(values).map(([modifier, value]) => [e(modifier), value]))
      const utilities = flatten({ [`.${e(`${base}`)}`]: escapedValues }, FLATTEN_CONFIG)

      addUtilities(
        _.mapKeys(utilities, (value, key) => handleName(key, base)),
        variants(variantName, ['responsive'])
      )
    })
}

/**
 *
 * @param {*} testConfig
 * @param {*} pluginOptions
 */

export const generatePluginCss = (testConfig = {}, pluginOptions = {}) => {
  const sandboxConfig = {
    corePlugins: false,
    variants: [],
  }
  const postcssPlugins = [
    tailwindcss({
      ...tailwindConfig,
      ...sandboxConfig,
      ...testConfig,
    }),
  ]

  return postcss(postcssPlugins)
    .process('@tailwind utilities', { from: undefined })
    .then((result) => result.css)
}
