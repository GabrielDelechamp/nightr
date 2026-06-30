import { StyleSheet } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { nightrMapStyle } from './nightr-map-style'

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
  latitude: 47.21811,
  longitude: -1.55448,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

export default function NightrMap({ initialRegion = DEFAULT_REGION }: Props) {
  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      customMapStyle={nightrMapStyle}
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
