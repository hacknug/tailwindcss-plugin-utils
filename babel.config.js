module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: '8' } }],
  ],
  plugins: [
    'babel-plugin-root-import',
  ],
}
