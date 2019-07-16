import {
  buildConfig,
  something,
} from './index.js'

module.exports = function (pluginOptions) {
  return function (coreUtils) {
    const defaultValues = {
      columnCount: [1, 2, 3],
      columnSpan: ['none', 'all'],
    }

    const pluginUtilities = {
      'col-count': buildConfig(defaultValues, coreUtils, 'columnCount'),
      'col-gap': buildConfig(defaultValues, coreUtils, 'columnGap', 'gap', 'gridGap'),
      'col-span': buildConfig(defaultValues, coreUtils, 'columnSpan'),
    }

    return something(pluginUtilities, coreUtils)
  }
}
