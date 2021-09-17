module.exports = {
  async rewrites() {
    return [
      {
        source: '/browse',
        destination: '/browse/filterIndex=0/saleModeIndex=0',
      }
    ]
  }
}
