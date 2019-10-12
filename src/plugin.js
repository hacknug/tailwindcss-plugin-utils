import pluginDefaultConfig from '../tailwind.config.js'
import { buildPlugin } from './index.js'

module.exports = (pluginOptions) => (coreUtils) => {
  return buildPlugin(coreUtils, pluginDefaultConfig, [
    { key: ['columnCount'], base: 'col-count' },
    { key: ['columnGap', 'gap', 'gridGap'], base: 'col-gap' },
    { key: ['columnSpan'], base: 'col-span' },
    // { key: ['textFillColor', 'borderColor'], base: 'text-fill', property: '-webkit-text-fill-color' },
    { key: ['textStrokeColor', 'borderColor'], base: 'text-stroke', property: '-webkit-text-stroke-color' },
    { key: ['textStrokeWidth', 'borderWidth'], base: 'text-stroke', property: '-webkit-text-stroke-width' },
    // { key: ['paintOrder'], base: 'paint' },
  ])
}
