import {
  buildConfig,
  something,
} from './index.js'

module.exports = function (pluginOptions) {
  return function (coreUtils) {
    const pluginUtilities = {
      'col-count': buildConfig(coreUtils, 'columnCount'),
      'col-gap': buildConfig(coreUtils, 'columnGap', 'gap', 'gridGap'),
      'col-span': buildConfig(coreUtils, 'columnSpan'),
    }

    return something(pluginUtilities, coreUtils)
  }
}
