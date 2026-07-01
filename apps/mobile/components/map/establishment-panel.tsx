import { useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleSheet, Text } from 'react-native'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types'
import { Colors } from '../../constants/colors'
import type { MapMarker } from './nightr-map'

type Props = {
  marker: MapMarker | null
  onClose: () => void
}

export default function EstablishmentPanel({ marker, onClose }: Props) {
  const sheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['40%', '100%'], [])

  useEffect(() => {
    if (marker) {
      sheetRef.current?.snapToIndex(0)
    } else {
      sheetRef.current?.close()
    }
  }, [marker])

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        onPress={onClose}
      />
    ),
    [onClose]
  )

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.name}>{marker?.title}</Text>
      </BottomSheetView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  name: {
    color: Colors.ivory,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
})
