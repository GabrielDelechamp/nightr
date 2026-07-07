import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FontFamily } from '../../constants/fonts'
import { isTrustedImageUrl } from '../../utils/safe-image'

const { width: W, height: H } = Dimensions.get('window')

type Props = {
  uris: string[]
  initialIndex: number
  visible: boolean
  onClose: () => void
}

export default function FullscreenPhoto({ uris, initialIndex, visible, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex)
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    if (visible) {
      setCurrent(initialIndex)
      listRef.current?.scrollToIndex({ index: initialIndex, animated: false })
    }
  }, [visible, initialIndex])

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={uris}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({ length: W, offset: W * index, index })}
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false })
          }}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / W)
            setCurrent(index)
          }}
          renderItem={({ item }) => (
            <Pressable style={styles.page} onPress={onClose}>
              {isTrustedImageUrl(item) ? (
                <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
              ) : (
                <View style={styles.fallback}>
                  <Ionicons name="image-outline" size={40} color="rgba(255,255,255,0.4)" />
                </View>
              )}
            </Pressable>
          )}
          keyExtractor={(_, i) => i.toString()}
        />

        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={22} color="white" />
        </Pressable>

        {uris.length > 1 && (
          <Text style={styles.counter}>{current + 1} / {uris.length}</Text>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  page: {
    width: W,
    height: H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: W,
    height: H,
  },
  fallback: {
    width: W,
    height: H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    fontFamily: FontFamily.medium,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    includeFontPadding: false,
  },
})
