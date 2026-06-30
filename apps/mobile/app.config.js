module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...config.plugins.filter((p) => p !== 'react-native-maps'),
    ['react-native-maps', { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '' }],
  ],
  android: {
    ...config.android,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
      },
    },
  },
  ios: {
    ...config.ios,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
    },
  },
})
