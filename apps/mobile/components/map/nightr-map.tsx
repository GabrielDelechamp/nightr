import { StyleSheet } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { nightrMapStyle } from './nightr-map-style'
import { Colors } from '../../constants/colors'

type Region = {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

export type MapMarker = {
  id: string
  latitude: number
  longitude: number
  title?: string
}

type Props = {
  initialRegion?: Region
  markers?: MapMarker[]
}

const DEFAULT_REGION: Region = {
  latitude: 47.21811,
  longitude: -1.55448,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

export default function NightrMap({ initialRegion = DEFAULT_REGION, markers = [] }: Props) {
  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      customMapStyle={nightrMapStyle}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          pinColor={Colors.purple}
        />
      ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
