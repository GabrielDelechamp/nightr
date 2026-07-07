import { StyleSheet, Text, View } from 'react-native'
import ClusterMapView from 'react-native-map-clustering'
import { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { nightrMapStyle } from './nightr-map-style'

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
  categoryName?: string
}

type Props = {
  initialRegion?: Region
  markers?: MapMarker[]
  onMarkerPress?: (marker: MapMarker) => void
}

const DEFAULT_REGION: Region = {
  latitude: 47.21811,
  longitude: -1.55448,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

type ClusterProps = {
  id: number
  geometry: { coordinates: [number, number] }
  onPress: () => void
  properties: { point_count: number }
}

function renderCluster(cluster: ClusterProps) {
  const { id, geometry, onPress, properties } = cluster
  const [longitude, latitude] = geometry.coordinates
  const count = properties.point_count

  return (
    <Marker
      key={`cluster-${id}`}
      coordinate={{ latitude, longitude }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.clusterOuter}>
        <View style={styles.clusterMiddle} />
        <Text style={styles.clusterText}>{count}</Text>
      </View>
    </Marker>
  )
}

export default function NightrMap({ initialRegion = DEFAULT_REGION, markers = [], onMarkerPress }: Props) {
  return (
    <ClusterMapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      customMapStyle={nightrMapStyle}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
      clusterColor="rgba(138, 43, 226, 0.55)"
      clusterTextColor="#ffffff"
      renderCluster={renderCluster}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          anchor={{ x: 0.5, y: 0.5 }}
          onPress={() => onMarkerPress?.(marker)}
        >
          <View style={styles.pinOuter}>
            <View style={styles.pinMiddle} />
            <View style={styles.pinInner} />
          </View>
          <Callout tooltip><View /></Callout>
        </Marker>
      ))}
    </ClusterMapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  pinOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    overflow: 'visible',
  },
  pinMiddle: {
    position: 'absolute',
    top: 7,
    left: 7,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(138, 43, 226, 0.55)',
  },
  pinInner: {
    position: 'absolute',
    top: 11,
    left: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  clusterOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    overflow: 'visible',
  },
  clusterMiddle: {
    position: 'absolute',
    top: 7,
    left: 7,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(138, 43, 226, 0.75)',
  },
  clusterText: {
    position: 'absolute',
    top: 14,
    left: 0,
    width: 44,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
})
