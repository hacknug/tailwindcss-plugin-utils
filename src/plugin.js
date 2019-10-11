import pluginDefaultConfig from '../tailwind.config.js'
import { buildPlugin } from './index.js'

module.exports = (pluginOptions) => (coreUtils) => {
  return buildPlugin(coreUtils, pluginDefaultConfig, [
    { 'col-count': ['columnCount'] },
    { 'col-gap': ['columnGap', 'gap', 'gridGap'] },
    { 'col-span': ['columnSpan'] },
    { 'text-stroke': ['textStrokeColor', 'borderColor'] },
    { 'text-stroke': ['textStrokeWidth', 'borderWidth'] },
  ])
}
