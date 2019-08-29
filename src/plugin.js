import pluginDefaultConfig from '../tailwind.config.js'
import { buildPlugin } from './index.js'

module.exports = (pluginOptions) => (coreUtils) => {
  return buildPlugin(pluginDefaultConfig, coreUtils, {
    'col-count': ['columnCount'],
    'col-gap': ['columnGap', 'gap', 'gridGap'],
    'col-span': ['columnSpan'],
  })
}
