import { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Colors } from '../../constants/colors'
import { FontFamily } from '../../constants/fonts'
import FullscreenPhoto from '../atomics/fullscreen-photo'
import type { Photo } from '@nightr/types'

type Props = {
  photos: Photo[]
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
          <Pressable
            key={photo.photo_id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => {
              setViewerIndex(index)
              setViewerVisible(true)
            }}
          >
            <Image source={{ uri: photo.url }} style={styles.image} resizeMode="cover" />
            {photo.is_cover && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Cover</Text>
              </View>
            )}
          </Pressable>
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
