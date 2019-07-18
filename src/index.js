import _ from 'lodash'
import flatten from 'flat'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
// import resolveConfig from 'tailwindcss/resolveConfig'
// import tailwindConfig from '~/tailwind.config.js'

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

export const buildConfig = (tailwindConfig, coreUtils, themeKey, ...fallbackKeys) => {
  const buildFromEntries = ([modifier, value]) => [modifier, { [themeKey]: value }]
  const themeSettings = getSettings(coreUtils.theme, themeKey, fallbackKeys)

  const settings = themeSettings || getSettings(tailwindConfig.theme, themeKey, fallbackKeys)
  const object = Array.isArray(settings) ? _.zipObject(settings, settings) : settings
  const flatObject = themeSettings ? flatten(object, FLATTEN_CONFIG) : object
  const entries = settings && Object.entries(flatObject).map(buildFromEntries)

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
 * buildPlugin()
 * @param {*} pluginUtilities
 * @param {*} coreUtils
 */

export const buildPlugin = (tailwindConfig, coreUtils, pluginRecipe) => {
  const { addUtilities, e, variants } = coreUtils
  const buildFromRecipe = ([key, value]) => [key, buildConfig(tailwindConfig, coreUtils, ...value)]
  const pluginUtilities = Object.entries(pluginRecipe).map(buildFromRecipe)

  return Object.entries(_.fromPairs(pluginUtilities))
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
 * generatePluginCss()
 * @param {*} testConfig
 * @param {*} pluginOptions
 */

export const generatePluginCss = (tailwindConfig = {}, testConfig = {}, pluginOptions = {}) => {
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
