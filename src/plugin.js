import tailwindConfig from '~/tailwind.config.js'
import { buildPlugin } from '~/src/index.js'

module.exports = function (pluginOptions) {
  return function (coreUtils) {
    return buildPlugin(tailwindConfig, coreUtils, {
      'col-count': ['columnCount'],
      'col-gap': ['columnGap', 'gap', 'gridGap'],
      'col-span': ['columnSpan'],
    })
  }
}
