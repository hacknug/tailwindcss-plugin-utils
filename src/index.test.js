import {
  FLATTEN_CONFIG,
  handleName,
  // prefixNegativeModifiers,
  buildConfig,
  // buildConfigFromTheme,
  // buildConfigFromArray,
} from './index'

/**
 * MOCKS:
 * - theme()
 * - defaultValues{}
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
  test('handles regular modifiers', () => {
    expect(handleName('.bg-tailwind', 'bg')).toBe('.bg-tailwind')
  })
  test('handles `default` modifiers', () => {
    expect(handleName('.border-default', 'border')).toBe('.border')
  })
  test('handles negative modifiers', () => {
    expect(handleName('.m--4', 'm')).toBe('.-m-4')
  })
})

describe('buildConfig()', () => {
  test('builds from theme() object', () => {
    expect(buildConfig('backgroundColor')).toStrictEqual({ tailwind: { backgroundColor: '#38b2ac' } })
  })
  test('builds from theme() object using fallbacks', () => {
    expect(buildConfig('textColor', 'backgroundColor')).toStrictEqual({ tailwind: { textColor: '#38b2ac' } })
  })
  test('builds from theme() array', () => {
    expect(buildConfig('columnCount')).toStrictEqual({ 2: { columnCount: 2 }, 4: { columnCount: 4 } })
  })
  test('builds from the defaultConfig', () => {
    expect(buildConfig('columnSpan')).toStrictEqual({ all: { columnSpan: 'all' }, none: { columnSpan: 'none' } })
  })
})
