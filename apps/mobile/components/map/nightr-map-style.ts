import type { MapStyleElement } from 'react-native-maps'

export const nightrMapStyle: MapStyleElement[] = [
  { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#002147' }] },
  { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#002147' }] },
  { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#faf2da' }] },

  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#fffaf1' }],
  },

  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#001a38' }],
  },

  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#1a3350' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#2f496a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#001a38' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#faf2da' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3a5a80' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1a3350' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#fffaf1' }],
  },

  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f496a' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#5e91ff' }],
  },

  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#001530' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#5e91ff' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#001530' }],
  },
]
