import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from '../components/navbar'
import NightrMap, { type MapMarker } from '../components/map/nightr-map'
import FilterBar, { type FilterState } from '../components/map/filter-bar'
import SearchBar from '../components/map/search-bar'
import EstablishmentPanel from '../components/map/establishment-panel'
import ErrorState from '../components/atomics/error-state'
import { getEstablishmentsByCity } from '@nightr/supabase'
import { useTheme } from '../context/ThemeContext'

type Tab = 'event' | 'trending' | 'map' | 'favorites' | 'profile'

const NANTES_CITY_ID = '2cb017fe-b5bf-4463-9306-4a65f1ca6a42'
const DEFAULT_FILTERS: FilterState = { live: false, ambiance: null, budget: null }

export default function Home() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>('map')
  const [allMarkers, setAllMarkers] = useState<MapMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(false)
  const lastFilters = useRef<FilterState>(DEFAULT_FILTERS)

  const fetchMarkers = useCallback((filters: FilterState) => {
    lastFilters.current = filters
    setError(false)
    getEstablishmentsByCity(NANTES_CITY_ID, {
      live: filters.live,
      ambiance: filters.ambiance,
      budget: filters.budget,
    })
      .then((establishments) =>
        setAllMarkers(
          establishments.map((e) => ({
            id: e.establishment_id,
            latitude: Number(e.latitude),
            longitude: Number(e.longitude),
            title: e.name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            categoryName: (e as any).categories?.name as string | undefined,
          }))
        )
      )
      .catch((err) => {
        console.error(err)
        setError(true)
      })
  }, [])

  useEffect(() => {
    fetchMarkers(DEFAULT_FILTERS)
  }, [fetchMarkers])

  const markers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return allMarkers
    return allMarkers.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) ||
        m.categoryName?.toLowerCase().includes(q)
    )
  }, [allMarkers, searchQuery])

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.content}>
        <NightrMap markers={markers} onMarkerPress={setSelectedMarker} />
        <View style={styles.overlay} pointerEvents="box-none">
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <FilterBar onFiltersChange={fetchMarkers} />
        </View>
        {error && (
          <View style={styles.errorOverlay} pointerEvents="box-none">
            <ErrorState onRetry={() => fetchMarkers(lastFilters.current)} />
          </View>
        )}
        <EstablishmentPanel marker={selectedMarker} onClose={() => setSelectedMarker(null)} />
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
  overlay: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    gap: 8,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbarWrapper: {
    paddingBottom: 10,
  },
})
