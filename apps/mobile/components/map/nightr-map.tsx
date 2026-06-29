import { StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import { nightrMapStyle } from './nightr-map-style'

// TODO: Switch to PROVIDER_GOOGLE + customMapStyle once GOOGLE_MAPS_API_KEY is set
const USE_GOOGLE_MAPS = !!process.env.GOOGLE_MAPS_API_KEY

type Region = {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

type Props = {
  initialRegion?: Region
}

const DEFAULT_REGION: Region = {
  latitude: 43.6047,
  longitude: 1.4442,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

export default function NightrMap({ initialRegion = DEFAULT_REGION }: Props) {
  return (
    <MapView
      style={styles.map}
      provider={USE_GOOGLE_MAPS ? 'google' : undefined}
      customMapStyle={USE_GOOGLE_MAPS ? nightrMapStyle : undefined}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
    />
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
