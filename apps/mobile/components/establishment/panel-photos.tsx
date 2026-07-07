import { useState } from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { FontFamily } from '../../constants/fonts'
import FullscreenPhoto from '../atomics/fullscreen-photo'
import { isTrustedImageUrl } from '../../utils/safe-image'
import type { Photo } from '@nightr/types'

type Props = {
  photos: Photo[]
}

type ImageStatus = 'loading' | 'loaded' | 'error'

function PhotoCard({ photo, onPress }: { photo: Photo; onPress: () => void }) {
  const trusted = isTrustedImageUrl(photo.url)
  const [status, setStatus] = useState<ImageStatus>(trusted ? 'loading' : 'error')

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={trusted ? onPress : undefined}
      disabled={!trusted}
    >
      {status === 'error' ? (
        <View style={styles.fallback}>
          <Ionicons name="image-outline" size={28} color={Colors.slateLight} />
        </View>
      ) : (
        <Image
          source={{ uri: photo.url }}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}

      {status === 'loading' && (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.purple} />
        </View>
      )}

      {photo.is_cover && status !== 'error' && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Cover</Text>
        </View>
      )}
    </Pressable>
  )
}

export default function PanelPhotos({ photos }: Props) {
  const [viewerIndex, setViewerIndex] = useState(0)
  const [viewerVisible, setViewerVisible] = useState(false)

  if (!photos.length) return null

  const uris = photos.map((p) => p.url)

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.scroll}
      >
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.photo_id}
            photo={photo}
            onPress={() => {
              setViewerIndex(index)
              setViewerVisible(true)
            }}
          />
        ))}
      </ScrollView>

      <FullscreenPhoto
        uris={uris}
        initialIndex={viewerIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 12,
  },
  row: {
    paddingHorizontal: 20,
    gap: 10,
  },
  card: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.slate,
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: FontFamily.medium,
    color: Colors.ivory,
    fontSize: 11,
    includeFontPadding: false,
  },
})
