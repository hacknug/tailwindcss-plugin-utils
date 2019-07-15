import _ from 'lodash'
import flatten from 'flat'

/**
 * CONSTANTS
 */

export const FLATTEN_CONFIG = { delimiter: '-', maxDepth: 2 }

/**
 * handleName()
 * @param {*} className
 * @param {*} base
 */

export function handleName (className, base) {
  const split = className.split(`${base}-`)
  const prefixedName = `${split[0]}${prefixNegativeModifiers(base, split[1])}`

  return prefixedName.split('-default').join('')
}

export function prefixNegativeModifiers (base, modifier) {
  return _.startsWith(modifier, '-') ? `-${base}-${modifier.slice(1)}` : `${base}-${modifier}`
}

/**
 * buildConfig()
 * @param {*} themeKey
 * @param  {...any} fallbackKeys
 */

export function buildConfig (themeKey, ...fallbackKeys) {
  const themeHoldsConfig = getThemeSettings(themeKey, fallbackKeys)

  const settings = themeHoldsConfig
    ? getThemeSettings(themeKey, fallbackKeys)
    : getPluginSettings(themeKey, fallbackKeys)
  const object = _.isArray(settings) ? _.zipObject(settings, settings) : settings
  const entries = settings && Object.entries(themeHoldsConfig ? flatten(object, FLATTEN_CONFIG) : object)
    .map(([modifier, value]) => [modifier, { [themeKey]: value }])

  return settings ? _.fromPairs(entries) : false
}

export function getThemeSettings (themeKey, fallbackKeys = []) {
  const [newThemeKey, ...newFallbackKeys] = fallbackKeys

  return (
    (!_.isEmpty(theme(themeKey, false)) && theme(themeKey, false)) ||
    (fallbackKeys.length && getThemeSettings(newThemeKey, newFallbackKeys))
  )
}

export function getPluginSettings (themeKey, fallbackKeys = []) {
  const [newThemeKey, ...newFallbackKeys] = fallbackKeys

  return (
    (!_.isEmpty(defaultValues[themeKey]) && defaultValues[themeKey]) ||
    (fallbackKeys.length && getPluginSettings(newThemeKey, newFallbackKeys))
  )
}
