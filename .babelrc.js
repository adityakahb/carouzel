const plugins = [
  /* Your babel plugins */
];
if (process.env.NODE_ENV === 'development') {
  plugins.push('istanbul');
}
module.exports = {
  plugins: plugins,
};
