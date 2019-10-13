import _ from 'lodash'
import flatten from 'flat'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'

/**
 * CONSTANTS
 */

export const FLATTEN_CONFIG = { delimiter: '-', maxDepth: 2 }

/**
 * handleName()
 *
 * @param {string} className
 * @param {string} base
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
 *
 * @param {Object} coreUtils
 * @param {Object} recipe
 */

export const buildConfigFromRecipe = (coreUtils, recipe) => {
  const { key: [themeKey, ...fallbackKeys], property, config } = recipe
  const buildFromEntries = ([modifier, value]) => [modifier, { [property || themeKey]: value }]
  const themeSettings = getSettings(coreUtils.theme, themeKey, fallbackKeys)

  const settings = themeSettings || getSettings(config.theme, themeKey, fallbackKeys)
  const object = Array.isArray(settings) ? _.zipObject(settings, settings) : settings
  const flatObject = themeSettings ? flatten(object, FLATTEN_CONFIG) : object
  const entries = settings && Object.entries(flatObject).map(buildFromEntries)

  return settings ? _.fromPairs(entries) : false
}

/**
 * getSettings()
 *
 * @param {function|Object} theme
 * @param {string} themeKey
 * @param {string[]} fallbackKeys
 */

export const getSettings = (theme, themeKey, fallbackKeys = []) => {
  const [newThemeKey, ...newFallbackKeys] = fallbackKeys
  const value = typeof theme === 'function' ? theme(themeKey, false) : theme[themeKey]

  return (
    (!_.isEmpty(value) && value) ||
    (fallbackKeys.length && getSettings(theme, newThemeKey, newFallbackKeys)) ||
    ({})
  )
}

/**
 * buildPlugin()
 *
 * @param {Object} coreUtils
 * @param {Object} pluginRecipes
 */
// TODO: Rename to denote it ONLY adds utilities
export const buildPlugin = (coreUtils, pluginRecipes) => {
  // TODO: Add support for String recipes?
  const prepareRecipe = (recipe) => {
    const {
      // TODO: Add support for String keys?
      key, // Array
      base = _.kebabCase(key[0]),
      property = _.kebabCase(key[0]),
      // TODO: Support passing default config using new core API
      config = {},
      // TODO: Support passing addUtilitiesOptions
      // options = { respectPrefix: false, respectImportant: false, variants: [] },
    } = recipe
    return key ? { key, base, property, config } : recipe
  }

  return (Array.isArray(pluginRecipes) ? pluginRecipes : [pluginRecipes])
    .map(prepareRecipe)
    .forEach((recipe) => {
      const { key, base, property, config } = recipe
      // TODO: Support specifying a property à la `tailwindcss-alpha` and `tailwindcss-custom-native`
      const buildFromRecipe = ([index, value]) => [index, buildConfigFromRecipe(coreUtils, recipe)]

      // TODO: All this mess is probably not required anymore
      return Object.entries(_.fromPairs(Object.entries({ [base]: key }).map(buildFromRecipe)))
        .filter(([modifier, values]) => !_.isEmpty(values))
        .forEach(([modifier, values]) => {
          const { addUtilities, e, variants } = coreUtils
          // const base = _.kebabCase(modifier).split('-').slice(0, 2).join('-')
          // const variantName = Object.keys(Object.entries(values)[0][1])[0]
          const flatValues = Object.entries(flatten({ [base]: values }, FLATTEN_CONFIG))
            .map(([className, value]) => [`.${e(`${className}`)}`, value])
          const utilities = _(flatValues).fromPairs().mapKeys((value, key) => handleName(key, base)).value()

          return addUtilities(utilities, {
            // TODO: Should it really default to ['responsive]?
            variants: variants(key[0], ['responsive']),
          })
        })
    })
}

/**
 * generatePluginCss()
 *
 * @param {Object} testConfig
 */

export const generatePluginCss = (testConfig = {}) => {
  // TODO: Allow users to specify which version of Tailwind to use?
  // TODO: Allow users to configure what is it that the helper generates aka `@tailwind utilities`
  const customizer = (objValue, srcValue, key) => {
    if (key === 'variants' && _.isArray(objValue) && _.isEmpty(objValue)) {
      return srcValue
    }
  }

  const sandboxConfig = {
    theme: { screens: { sm: '640px' } },
    corePlugins: false,
    variants: [],
  }

  const configs = [sandboxConfig, testConfig]
  const postcssPlugins = [
    tailwindcss(_.mergeWith({}, ...configs, customizer)),
  ]

  return postcss(postcssPlugins)
    .process('@tailwind utilities', { from: undefined })
    .then((result) => result.css)
}
