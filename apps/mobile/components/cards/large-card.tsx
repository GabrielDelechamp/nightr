import { View, Text, ImageBackground, Pressable, StyleSheet, Platform, ImageSourcePropType } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { Variant } from '../../constants/variants'
import Tag from '../atomics/tag'
import Badge from '../atomics/badge'

type TagItem = {
  label: string
  icon?: keyof typeof Ionicons.glyphMap
  color?: string
  variant?: Variant
}

type Props = {
  image: ImageSourcePropType
  badge?: string
  badgeIcon?: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
  tags?: TagItem[]
  bottomChip?: string
  onPress?: () => void
  onShare?: () => void
  onFavorite?: () => void
}

function ActionButton({
  icon,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  onPress?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Ionicons name={icon} size={18} color={Colors.ivory} />
    </Pressable>
  )
}

export default function LargeCard({
  image,
  badge,
  badgeIcon = 'flame-outline',
  title,
  subtitle,
  tags,
  bottomChip,
  onPress,
  onShare,
  onFavorite,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.95 : 1 }]}
    >
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>

        {/* Top row */}
        <View style={styles.topRow}>
          {badge && (
            <Tag label={badge} icon={badgeIcon} variant="filled" color={Colors.navy} />
          )}
          <View style={styles.actions}>
            <ActionButton icon="share-social-outline" onPress={onShare} />
            <ActionButton icon="star-outline" onPress={onFavorite} />
          </View>
        </View>

        {/* Bottom gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.82)']}
          locations={[0, 1]}
          style={styles.gradient}
        >
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>

          {tags && tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map((tag, i) => (
                <Tag
                  key={i}
                  label={tag.label}
                  icon={tag.icon}
                  variant={tag.variant ?? 'outline'}
                  color={tag.color ?? Colors.ivory}
                />
              ))}
            </View>
          )}

          {bottomChip && (
            <Badge label={bottomChip} variant="outline" color={Colors.blue} />
          )}
        </LinearGradient>

      </ImageBackground>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  image: {
    height: 280,
    justifyContent: 'space-between',
  },

  imageStyle: {
    borderRadius: 20,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gradient: {
    paddingHorizontal: 14,
    paddingTop: 40,
    paddingBottom: 14,
    gap: 6,
  },

  title: {
    color: Colors.ivory,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '400',
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
})


{/* <LargeCard
          image={{ uri: 'https://}}
          badge="Trending"
          title="Villa du Taur"
          subtitle="17 april • Place du Cirque"
          tags={[
            { label: 'Très demandé', icon: 'people-outline',        variant: 'outline',   color: Colors.purple },
            { label: 'House',        icon: 'musical-note-outline' },
            { label: '900m',         icon: 'location-outline' },
          ]}
          bottomChip="Entrée libre"
          onShare={() => {}}
          onFavorite={() => {}}
          onPress={() => {}}
  /> */}