import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, AppState, Pressable, StyleSheet, View } from 'react-native'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types'
import { Ionicons } from '@expo/vector-icons'
import { getEstablishmentById } from '@nightr/supabase'
import type { EstablishmentFull } from '@nightr/types'
import { Colors } from '../../constants/colors'
import type { MapMarker } from './nightr-map'
import PanelHeader from '../establishment/panel-header'
import PanelActions from '../establishment/panel-actions'
import PanelPhotos from '../establishment/panel-photos'
import PanelTabs, { type TabKey } from '../establishment/panel-tabs'
import OverviewTab from '../establishment/tabs/overview-tab'
import ReviewsTab from '../establishment/tabs/reviews-tab'
import GalleryTab from '../establishment/tabs/gallery-tab'
import AboutTab from '../establishment/tabs/about-tab'
import ErrorState from '../atomics/error-state'

type Props = {
  marker: MapMarker | null
  onClose: () => void
}

export default function EstablishmentPanel({ marker, onClose }: Props) {
  const sheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['40%', '100%'], [])
  const [establishment, setEstablishment] = useState<EstablishmentFull | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [isFav, setIsFav] = useState(false)

  const loadEstablishment = useCallback((id: string) => {
    setLoading(true)
    setError(false)
    getEstablishmentById(id)
      .then((data) => setEstablishment(data))
      .catch((err) => {
        console.error(err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const markerRef = useRef(marker)
  markerRef.current = marker

  useEffect(() => {
    const appState = { current: AppState.currentState }
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active' && markerRef.current) {
        loadEstablishment(markerRef.current.id)
      }
      appState.current = nextState
    })
    return () => subscription.remove()
  }, [loadEstablishment])

  useEffect(() => {
    if (marker) {
      sheetRef.current?.snapToIndex(0)
      setEstablishment(null)
      setActiveTab('overview')
      setIsFav(false)
      loadEstablishment(marker.id)
    } else {
      sheetRef.current?.close()
    }
  }, [marker, loadEstablishment])

  const handleClose = useCallback(() => {
    setEstablishment(null)
    onClose()
  }, [onClose])

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        onPress={handleClose}
      />
    ),
    [handleClose]
  )

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onClose={handleClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.purple} size="large" />
        </View>
      ) : error ? (
        <ErrorState onRetry={() => marker && loadEstablishment(marker.id)} />
      ) : establishment ? (
        <>
          {/* Bouton favoris flottant */}
          <Pressable
            style={styles.favBtn}
            onPress={() => setIsFav((v) => !v)}
            hitSlop={10}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={22}
              color={isFav ? Colors.blue : 'rgba(255,250,241,0.5)'}
            />
          </Pressable>

          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <PanelHeader
              name={establishment.name}
              category={establishment.categories}
              opening_hours={establishment.opening_hours ?? []}
              reviews={establishment.reviews ?? []}
            />
            <PanelActions
              name={establishment.name}
              address={establishment.address}
              phone={establishment.phone}
            />
            <PanelPhotos photos={establishment.photos ?? []} />
            <PanelTabs active={activeTab} onChange={setActiveTab} />
            {activeTab === 'overview' && <OverviewTab establishment={establishment} />}
            {activeTab === 'reviews' && <ReviewsTab reviews={establishment.reviews ?? []} />}
            {activeTab === 'gallery' && <GalleryTab photos={establishment.photos ?? []} />}
            {activeTab === 'about' && <AboutTab establishment={establishment} />}
          </BottomSheetScrollView>
        </>
      ) : null}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.navy,
  },
  handle: {
    backgroundColor: Colors.slate,
    width: 36,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  favBtn: {
    position: 'absolute',
    top: 14,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(47,73,106,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
