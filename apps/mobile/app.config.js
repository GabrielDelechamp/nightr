const { withAndroidManifest } = require('@expo/config-plugins')

const withGoogleMapsApiKey = (config) =>
  withAndroidManifest(config, (mod) => {
    const mainApp = mod.modResults.manifest.application[0]
    if (!mainApp['meta-data']) mainApp['meta-data'] = []

    mainApp['meta-data'] = mainApp['meta-data'].filter(
      (item) => item.$['android:name'] !== 'com.google.android.geo.API_KEY'
    )
    mainApp['meta-data'].push({
      $: {
        'android:name': 'com.google.android.geo.API_KEY',
        'android:value': process.env.GOOGLE_MAPS_API_KEY ?? '',
      },
    })
    return mod
  })

module.exports = ({ config }) =>
  withGoogleMapsApiKey({
    ...config,
    plugins: [
      ...config.plugins.filter((p) => p !== 'react-native-maps'),
      'react-native-maps',
    ],
    ios: {
      ...config.ios,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
      },
    },
  })
