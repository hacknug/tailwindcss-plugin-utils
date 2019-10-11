import {
  FLATTEN_CONFIG,
  handleName,
  buildConfig,
  generatePluginCss,
} from './index'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'

import escapeClassName from 'tailwindcss/lib/util/escapeClassName'
import prefixSelector from 'tailwindcss/lib/util/prefixSelector'

expect.extend({ toMatchCss: require('jest-matcher-css') })

/**
 * MOCKS:
 * - coreUtils()
 */

const config = resolveConfig(tailwindConfig)
const coreUtils = {
  config: resolveConfig(tailwindConfig),
  theme: (themeKey, fallbackValue) => config.theme[themeKey] || fallbackValue,
  prefix: (selector) => prefixSelector(config.prefix, selector),
  e: escapeClassName,
}

/**
 * TESTS:
 */

describe('CONSTANTS', () => {
  test('FLATTEN_CONFIG exists && holds the settings', () => {
    expect(typeof FLATTEN_CONFIG).toBe('object')
    expect(FLATTEN_CONFIG.delimiter).toBe('-')
    expect(FLATTEN_CONFIG.maxDepth).toBeTruthy()
  })
})

describe('handleName()', () => {
  test('is a function', () => {
    expect(typeof handleName).toBe('function')
  })
  test('with regular modifiers', () => {
    expect(handleName('.bg-tailwind', 'bg')).toBe('.bg-tailwind')
  })
  test('with `default` modifiers', () => {
    expect(handleName('.border-default', 'border')).toBe('.border')
  })
  test('with negative modifiers', () => {
    expect(handleName('.m--4', 'm')).toBe('.-m-4')
  })
})

describe('buildConfig()', () => {
  test('from theme() object', () => {
    expect(buildConfig(tailwindConfig, coreUtils, 'backgroundColor'))
      .toStrictEqual({ tailwind: { backgroundColor: '#38b2ac' } })
  })
  test('from theme() object using fallbacks', () => {
    expect(buildConfig(tailwindConfig, coreUtils, 'textColor', 'backgroundColor'))
      .toStrictEqual({ tailwind: { textColor: '#38b2ac' } })
  })
  test('from theme() array', () => {
    expect(buildConfig(tailwindConfig, coreUtils, 'columnCount'))
      .toStrictEqual({ 2: { columnCount: 2 }, 4: { columnCount: 4 } })
  })
  test('from theme() undefined', () => {
    expect(buildConfig(tailwindConfig, coreUtils, 'backgroundImage'))
      .toStrictEqual({})
  })
  test('from defaultConfig object', () => {
    expect(buildConfig(tailwindConfig, coreUtils, 'columnSpan'))
      .toStrictEqual({ all: { columnSpan: 'all' }, none: { columnSpan: 'none' } })
  })
  test('from defaultConfig object using fallbacks', () => {
    expect(buildConfig(tailwindConfig, coreUtils, 'gap', 'columnGap'))
      .toStrictEqual({ 4: { gap: '1rem' }, 8: { gap: '2rem' }, '1/2': { gap: '50%' } })
  })
})

describe('generatePluginCss()', () => {
  test('default utilities', () => {
    const testConfig = {}
    const expectedCss = `
      .col-count-2 { column-count: 2 }
      .col-count-4 { column-count: 4 }

      .col-gap-4 { column-gap: 1rem }
      .col-gap-8 { column-gap: 2rem }
      .col-gap-1\\/2 { column-gap: 50% }

      .col-span-none { column-span: none }
      .col-span-all { column-span: all }

      .text-stroke-red { text-stroke-color: red }
      .text-stroke-2 { text-stroke-width: 2px }
    `

    return generatePluginCss(tailwindConfig, testConfig)
      .then(css => expect(css).toMatchCss(expectedCss))
  })
  test('responsive variants', () => {
    const testConfig = { variants: ['responsive'] }
    const expectedCss = `
      .col-count-2 { column-count: 2 }
      .col-count-4 { column-count: 4 }

      .col-gap-4 { column-gap: 1rem }
      .col-gap-8 { column-gap: 2rem }
      .col-gap-1\\/2 { column-gap: 50% }

      .col-span-none { column-span: none }
      .col-span-all { column-span: all }

      .text-stroke-red { text-stroke-color: red }
      .text-stroke-2 { text-stroke-width: 2px }

      @media (min-width: 640px) {
        .sm\\:col-count-2 { column-count: 2 }
        .sm\\:col-count-4 { column-count: 4 }

        .sm\\:col-gap-4 { column-gap: 1rem }
        .sm\\:col-gap-8 { column-gap: 2rem }
        .sm\\:col-gap-1\\/2 { column-gap: 50% }

        .sm\\:col-span-none { column-span: none }
        .sm\\:col-span-all { column-span: all }

        .sm\\:text-stroke-red { text-stroke-color: red }
        .sm\\:text-stroke-2 { text-stroke-width: 2px }
      }
    `

    return generatePluginCss(tailwindConfig, testConfig)
      .then(css => expect(css).toMatchCss(expectedCss))
  })
  test('handles merging configs correctly', () => {
    const testConfig = {
      theme: { screens: { md: '768px' } },
      variants: ['responsive'],
    }
    const expectedCss = `
      .col-count-2 { column-count: 2 }
      .col-count-4 { column-count: 4 }

      .col-gap-4 { column-gap: 1rem }
      .col-gap-8 { column-gap: 2rem }
      .col-gap-1\\/2 { column-gap: 50% }

      .col-span-none { column-span: none }
      .col-span-all { column-span: all }

      .text-stroke-red { text-stroke-color: red }
      .text-stroke-2 { text-stroke-width: 2px }

      @media (min-width: 640px) {
        .sm\\:col-count-2 { column-count: 2 }
        .sm\\:col-count-4 { column-count: 4 }

        .sm\\:col-gap-4 { column-gap: 1rem }
        .sm\\:col-gap-8 { column-gap: 2rem }
        .sm\\:col-gap-1\\/2 { column-gap: 50% }

        .sm\\:col-span-none { column-span: none }
        .sm\\:col-span-all { column-span: all }

        .sm\\:text-stroke-red { text-stroke-color: red }
        .sm\\:text-stroke-2 { text-stroke-width: 2px }
      }

      @media (min-width: 768px) {
        .md\\:col-count-2 { column-count: 2 }
        .md\\:col-count-4 { column-count: 4 }

        .md\\:col-gap-4 { column-gap: 1rem }
        .md\\:col-gap-8 { column-gap: 2rem }
        .md\\:col-gap-1\\/2 { column-gap: 50% }

        .md\\:col-span-none { column-span: none }
        .md\\:col-span-all { column-span: all }

        .md\\:text-stroke-red { text-stroke-color: red }
        .md\\:text-stroke-2 { text-stroke-width: 2px }
      }
    `

    return generatePluginCss(tailwindConfig, testConfig)
      .then(css => expect(css).toMatchCss(expectedCss))
  })
  test('handles merging mixed `variants`', () => {
    const testConfig = {
      variants: {
        columnCount: ['focus'],
        columnGap: ['hover'],
        columnSpan: ['responsive'],
      },
    }
    const expectedCss = `
      .col-count-2 { column-count: 2 }
      .col-count-4 { column-count: 4 }

      .focus\\:col-count-2:focus { column-count: 2 }
      .focus\\:col-count-4:focus { column-count: 4 }

      .col-gap-4 { column-gap: 1rem }
      .col-gap-8 { column-gap: 2rem }
      .col-gap-1\\/2 { column-gap: 50% }

      .hover\\:col-gap-4:hover { column-gap: 1rem }
      .hover\\:col-gap-8:hover { column-gap: 2rem }
      .hover\\:col-gap-1\\/2:hover { column-gap: 50% }

      .col-span-none { column-span: none }
      .col-span-all { column-span: all }

      .text-stroke-red { text-stroke-color: red }
      .text-stroke-2 { text-stroke-width: 2px }

      @media (min-width: 640px) {
        .sm\\:col-span-none { column-span: none }
        .sm\\:col-span-all { column-span: all }

        .sm\\:text-stroke-red { text-stroke-color: red }
        .sm\\:text-stroke-2 { text-stroke-width: 2px }
      }
    `

    return generatePluginCss(tailwindConfig, testConfig)
      .then(css => expect(css).toMatchCss(expectedCss))
  })
  test('handles nested recipes', () => {
    const testConfig = {}
    const expectedCss = `
      .col-count-2 { column-count: 2 }
      .col-count-4 { column-count: 4 }

      .col-gap-4 { column-gap: 1rem }
      .col-gap-8 { column-gap: 2rem }
      .col-gap-1\\/2 { column-gap: 50% }

      .col-span-none { column-span: none }
      .col-span-all { column-span: all }

      .text-stroke-red { text-stroke-color: red }
      .text-stroke-2 { text-stroke-width: 2px }
    `

    return generatePluginCss(tailwindConfig, testConfig)
      .then(css => expect(css).toMatchCss(expectedCss))
  })
})

// TODO: Use tailwind.config.js to hold the plugin's default values
describe('buildPlugin()', () => {
  // test.todo('generates default utilities and responsive variants')
  // test.todo('variants can be customized')
  // test.todo('utilities can be customized')
  // test.todo('modifier can contain fractions')
  // test.todo('uses defaultValues as fallback')
  test.todo('respects tailwind\'s important config option')
  test.todo('generates negative utilities') // Probably redundant now that handleName() is tested
  test.todo('generates mixed utilities correctly') // Probably redundant now that handleName() is tested
})
