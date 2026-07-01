import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from '../components/navbar'
import NightrMap, { type MapMarker } from '../components/map/nightr-map'
import { getEstablishmentsByCity } from '@nightr/supabase'
import { useTheme } from '../context/ThemeContext'

type Tab = 'event' | 'trending' | 'map' | 'favorites' | 'profile'

const NANTES_CITY_ID = '2cb017fe-b5bf-4463-9306-4a65f1ca6a42'

export default function Home() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>('map')
  const [markers, setMarkers] = useState<MapMarker[]>([])

  useEffect(() => {
    getEstablishmentsByCity(NANTES_CITY_ID)
      .then((establishments) =>
        setMarkers(
          establishments.map((e) => ({
            id: e.establishment_id,
            latitude: Number(e.latitude),
            longitude: Number(e.longitude),
            title: e.name,
          }))
        )
      )
      .catch(console.error)
  }, [])

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.content}>
        <NightrMap markers={markers} />
      </View>
      <View style={styles.navbarWrapper}>
        <Navbar activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  navbarWrapper: {
    paddingBottom: 10,
  },
})
