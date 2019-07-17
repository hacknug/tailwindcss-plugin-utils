import tailwindConfig from '~/tailwind.config.js'
import { buildConfig, something } from '~/src/index.js'

module.exports = function (pluginOptions) {
  return function (coreUtils) {
    const pluginUtilities = {
      'col-count': buildConfig(coreUtils, tailwindConfig, 'columnCount'),
      'col-gap': buildConfig(coreUtils, tailwindConfig, 'columnGap', 'gap', 'gridGap'),
      'col-span': buildConfig(coreUtils, tailwindConfig, 'columnSpan'),
    }

    return something(pluginUtilities, coreUtils)
  }
}
