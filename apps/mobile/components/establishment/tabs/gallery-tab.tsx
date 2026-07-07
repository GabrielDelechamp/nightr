import { useState } from 'react'
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../constants/colors'
import { FontFamily } from '../../../constants/fonts'
import FullscreenPhoto from '../../atomics/fullscreen-photo'
import { isTrustedImageUrl } from '../../../utils/safe-image'
import type { Photo } from '@nightr/types'

const { width: W } = Dimensions.get('window')
const H_PADDING = 12
const GAP = 6
const FULL_W = W - H_PADDING * 2
const HALF_W = (FULL_W - GAP) / 2

type Props = { photos: Photo[] }

function GalleryImage({
  uri,
  cardStyle,
  imageStyle,
  onPress,
}: {
  uri: string
  cardStyle: object
  imageStyle: object
  onPress: () => void
}) {
  const trusted = isTrustedImageUrl(uri)

  return (
    <Pressable
      style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      onPress={trusted ? onPress : undefined}
      disabled={!trusted}
    >
      {trusted ? (
        <Image source={{ uri }} style={imageStyle} resizeMode="cover" />
      ) : (
        <View style={[imageStyle, styles.fallback]}>
          <Ionicons name="image-outline" size={24} color={Colors.slateLight} />
        </View>
      )}
    </Pressable>
  )
}

export default function GalleryTab({ photos }: Props) {
  const [viewerIndex, setViewerIndex] = useState(0)
  const [viewerVisible, setViewerVisible] = useState(false)

  if (!photos.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucune photo disponible</Text>
      </View>
    )
  }

  const uris = photos.map((p) => p.url)

  // Groupe les photos : 1 pleine largeur, puis 2 côte à côte, en alternance
  const rows: Array<{ type: 'full'; index: number } | { type: 'pair'; indexA: number; indexB: number }> = []
  let i = 0
  while (i < photos.length) {
    rows.push({ type: 'full', index: i })
    i++
    if (i < photos.length) {
      const indexB = i + 1 < photos.length ? i + 1 : -1
      rows.push({ type: 'pair', indexA: i, indexB })
      i += indexB === -1 ? 1 : 2
    }
  }

  const open = (index: number) => {
    setViewerIndex(index)
    setViewerVisible(true)
  }

  return (
    <>
      <View style={styles.grid}>
        {rows.map((row, ri) =>
          row.type === 'full' ? (
            <GalleryImage
              key={ri}
              uri={uris[row.index]}
              cardStyle={styles.fullCard}
              imageStyle={styles.fullImage}
              onPress={() => open(row.index)}
            />
          ) : (
            <View key={ri} style={styles.pairRow}>
              <GalleryImage
                uri={uris[row.indexA]}
                cardStyle={styles.halfCard}
                imageStyle={styles.halfImage}
                onPress={() => open(row.indexA)}
              />
              {row.indexB !== -1 ? (
                <GalleryImage
                  uri={uris[row.indexB as number]}
                  cardStyle={styles.halfCard}
                  imageStyle={styles.halfImage}
                  onPress={() => open(row.indexB as number)}
                />
              ) : (
                <View style={[styles.halfCard, styles.halfCardEmpty]} />
              )}
            </View>
          )
        )}
      </View>

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
  grid: {
    paddingHorizontal: H_PADDING,
    paddingTop: 12,
    paddingBottom: 24,
    gap: GAP,
  },
  fullCard: {
    width: FULL_W,
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.slate,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  pairRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halfCard: {
    width: HALF_W,
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.slate,
  },
  halfCardEmpty: {
    backgroundColor: 'transparent',
  },
  halfImage: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.8,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: 'rgba(255,250,241,0.4)',
  },
})
