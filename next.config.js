module.exports = {
  images: {
    domains: ["images.unsplash.com"]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    return config
  },
}
