import tailwindConfig from '../tailwind.config.js'
import { buildPlugin } from './index.js'

module.exports = (pluginOptions) => (coreUtils) => {
  return buildPlugin(tailwindConfig, coreUtils, {
    'col-count': ['columnCount'],
    'col-gap': ['columnGap', 'gap', 'gridGap'],
    'col-span': ['columnSpan'],
  })
}
