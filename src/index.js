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
 * @param {Object} tailwindConfig
 * @param {Object} coreUtils
 * @param {string} themeKey
 * @param {...string} fallbackKeys
 */

export const buildConfig = (coreUtils, tailwindConfig, themeKey, ...fallbackKeys) => {
  const buildFromEntries = ([modifier, value]) => [modifier, { [themeKey]: value }]
  const themeSettings = getSettings(coreUtils.theme, themeKey, fallbackKeys)

  const settings = themeSettings || getSettings(tailwindConfig.theme, themeKey, fallbackKeys)
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
 * @param {Object} tailwindConfig
 * @param {Object} coreUtils
 * @param {Object} pluginRecipe
 */

export const buildPlugin = (coreUtils, tailwindConfig, pluginRecipe) => {
  const { addUtilities, e, variants } = coreUtils
  // TODO: Support specifying a property à la `tailwindcss-alpha` and `tailwindcss-custom-native`
  const recipes = Array.isArray(pluginRecipe) ? pluginRecipe : [pluginRecipe]

  return recipes.forEach((recipe) => {
    const buildFromRecipe = ([key, value]) => [key, buildConfig(coreUtils, tailwindConfig, ...value)]

    return Object.entries(_.fromPairs(Object.entries(recipe).map(buildFromRecipe)))
      .filter(([modifier, values]) => !_.isEmpty(values))
      .forEach(([modifier, values]) => {
        const base = _.kebabCase(modifier).split('-').slice(0, 2).join('-')
        const variantName = Object.keys(Object.entries(values)[0][1])[0]
        const flatValues = Object.entries(flatten({ [base]: values }, FLATTEN_CONFIG))
          .map(([className, value]) => [`.${e(`${className}`)}`, value])
        const utilities = _(flatValues).fromPairs().mapKeys((value, key) => handleName(key, base)).value()

        return addUtilities(utilities, variants(variantName, ['responsive']))
      })
  })
}

/**
 * generatePluginCss()
 *
 * @param {Object} tailwindConfig
 * @param {Object} testConfig
 */

export const generatePluginCss = (tailwindConfig = {}, testConfig = {}) => {
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

  const configs = [tailwindConfig, sandboxConfig, testConfig]
  const postcssPlugins = [
    tailwindcss(_.mergeWith({}, ...configs, customizer)),
  ]

  return postcss(postcssPlugins)
    .process('@tailwind utilities', { from: undefined })
    .then((result) => result.css)
}
