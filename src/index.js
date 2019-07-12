import _ from 'lodash'
import flatten from 'flat'

export const FLATTEN_CONFIG = { delimiter: '-', maxDepth: 2 }

export const handleName = (className, base) => {
  const split = className.split(`${base}-`)
  const prefixedName = `${split[0]}${prefixNegativeModifiers(base, split[1])}`

  return prefixedName.split('-default').join('')
}

export const prefixNegativeModifiers = (base, modifier) => {
  return _.startsWith(modifier, '-') ? `-${base}-${modifier.slice(1)}` : `${base}-${modifier}`
}

export const buildConfig = (themeKey, ...fallbackKeys) => {
  return buildConfigFromTheme(themeKey, ...fallbackKeys) || buildConfigFromArray(themeKey)
}

export const buildConfigFromTheme = (themeKey, ...fallbackKeys) => {
  const getThemeSettings = (themeKey, fallbackKeys) => {
    const [newThemeKey, ...newFallbackKeys] = fallbackKeys || []
    return (
      (!_.isEmpty(theme(themeKey, false)) && theme(themeKey, false)) ||
      (fallbackKeys.length && getThemeSettings(newThemeKey, newFallbackKeys))
    )
  }

  const themeSettings = getThemeSettings(themeKey, fallbackKeys)
  const themeObject = _.isArray(themeSettings) ? _.zipObject(themeSettings, themeSettings) : themeSettings
  const themeEntries = themeSettings && Object.entries(flatten(themeObject, FLATTEN_CONFIG))
    .map(([modifier, value]) => [modifier, { [themeKey]: value }])

  return themeSettings ? _.fromPairs(themeEntries) : false
}

export const buildConfigFromArray = (property) => {
  const defaultSettings = defaultValues[property]
  const defaultEntries = defaultSettings && defaultSettings
    .map(value => ([value, { [property]: value }]))

  return defaultSettings ? _.fromPairs(defaultEntries) : false
}
