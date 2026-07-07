import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, AppState, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Navbar from '../components/navbar'
import NightrMap, { type MapMarker } from '../components/map/nightr-map'
import FilterBar, { type FilterState } from '../components/map/filter-bar'
import SearchBar from '../components/map/search-bar'
import EstablishmentPanel from '../components/map/establishment-panel'
import ErrorState from '../components/atomics/error-state'
import { Colors } from '../constants/colors'
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
  const [loading, setLoading] = useState(true)
  const lastFilters = useRef<FilterState>(DEFAULT_FILTERS)
  const appState = useRef(AppState.currentState)
  const requestId = useRef(0)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchMarkers = useCallback((filters: FilterState) => {
    lastFilters.current = filters
    const currentRequestId = ++requestId.current
    setError(false)
    setLoading(true)
    getEstablishmentsByCity(NANTES_CITY_ID, {
      live: filters.live,
      ambiance: filters.ambiance,
      budget: filters.budget,
    })
      .then((establishments) => {
        if (requestId.current !== currentRequestId) return // réponse obsolète, ignorée
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
      })
      .catch((err) => {
        if (requestId.current !== currentRequestId) return
        console.error(err)
        setError(true)
      })
      .finally(() => {
        if (requestId.current !== currentRequestId) return
        setLoading(false)
      })
  }, [])

  // Chips de filtre : on laisse l'utilisateur toggler plusieurs fois avant de tirer une seule requête.
  const debouncedFetchMarkers = useCallback((filters: FilterState) => {
    lastFilters.current = filters
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => fetchMarkers(filters), 400)
  }, [fetchMarkers])

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  useEffect(() => {
    fetchMarkers(DEFAULT_FILTERS)
  }, [fetchMarkers])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        fetchMarkers(lastFilters.current)
      }
      appState.current = nextState
    })
    return () => subscription.remove()
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
          <View style={styles.searchRow}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            <Pressable
              onPress={() => fetchMarkers(lastFilters.current)}
              style={styles.refreshBtn}
              disabled={loading}
              hitSlop={8}
            >
              {loading && allMarkers.length > 0 ? (
                <ActivityIndicator color={Colors.ivory} size="small" />
              ) : (
                <Ionicons name="refresh" size={18} color={Colors.ivory} />
              )}
            </Pressable>
          </View>
          <FilterBar onFiltersChange={debouncedFetchMarkers} />
        </View>
        {loading && !error && allMarkers.length === 0 && (
          <View style={styles.centerOverlay} pointerEvents="none">
            <ActivityIndicator color={Colors.purple} size="large" />
          </View>
        )}
        {error && (
          <View style={styles.centerOverlay} pointerEvents="box-none">
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,33,71,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(47,73,106,0.6)',
  },
  centerOverlay: {
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
