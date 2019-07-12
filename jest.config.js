module.exports = {
  globals: {
    theme: (themeKey, fallbackValue) => {
      const mockConfig = {
        backgroundColor: { tailwind: '#38b2ac' },
        columnCount: [2, 4],
      }

      return mockConfig[themeKey] || fallbackValue
    },
    defaultValues: {
      columnSpan: ['none', 'all'],
    },
  },
}
