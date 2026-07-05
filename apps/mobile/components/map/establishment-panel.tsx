import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types'
import { getEstablishmentById } from '@nightr/supabase'
import type { EstablishmentFull } from '@nightr/types'
import { Colors } from '../../constants/colors'
import type { MapMarker } from './nightr-map'
import PanelHeader from '../establishment/panel-header'
import PanelActions from '../establishment/panel-actions'
import PanelPhotos from '../establishment/panel-photos'
import PanelTabs, { type TabKey } from '../establishment/panel-tabs'
import OverviewTab from '../establishment/tabs/overview-tab'

type Props = {
  marker: MapMarker | null
  onClose: () => void
}

export default function EstablishmentPanel({ marker, onClose }: Props) {
  const sheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['40%', '100%'], [])
  const [establishment, setEstablishment] = useState<EstablishmentFull | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  useEffect(() => {
    if (marker) {
      sheetRef.current?.snapToIndex(0)
      setLoading(true)
      setEstablishment(null)
      getEstablishmentById(marker.id)
        .then((data) => setEstablishment(data as EstablishmentFull))
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      sheetRef.current?.close()
    }
  }, [marker])

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
      ) : establishment ? (
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
        </BottomSheetScrollView>
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
})
